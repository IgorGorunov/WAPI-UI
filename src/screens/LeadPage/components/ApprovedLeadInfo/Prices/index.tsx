import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import {PriceInfoType, UserStatusType} from "@/types/leads";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import NDA from "./NDA";
import {ApiResponseType} from "@/types/api";
import {getPricesInfo, sendSignNDA} from "@/services/leads";
import useAuth from "@/context/authContext";
import PricesBlock from "./PricesBlock";
import leadTutorialInfo from "@/screens/LeadPage/components/ApprovedLeadInfo/leadTutorialUrlsAndTexts";
import LeadTutorialStep from "@/screens/LeadPage/components/LeadTutorialStep";
import useTenant from "@/context/tenantContext";

type PricesPropsType = {
}

const Prices: React.FC<PricesPropsType> = () => {
    const { tenantData: { alias }} = useTenant();
    const {token, userStatus, setUserStatus} = useAuth();
    const [showPrices, setShowPrices] = useState(userStatus === UserStatusType.NoLegalPrices || userStatus === UserStatusType.LegalPrices);
    const [showNDA, setShowNDA] = useState(false);
    const [curPrices, setCurPrices] = useState<PriceInfoType[] | null>(null);

    const fetchPricesInfo = useCallback(async () => {
        try {
            const res: ApiResponseType = await getPricesInfo({token, alias});

            if (res && "data" in res) {
                setCurPrices(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    },[]);

    useEffect(()=>{
        if (showPrices) {
            fetchPricesInfo();
        }
    }, [showPrices]);

    const handleSignNDA = async() => {

        //send info that NDA was signed
        try {
            const res: ApiResponseType = await sendSignNDA(
                {
                    token,
                    alias
                }
            );

            if (res && "status" in res && res?.status === 200) {
                //success
                setShowNDA(false);
                setShowPrices(true);
                setUserStatus(userStatus === UserStatusType.NoLegalNoPrices ? UserStatusType.NoLegalPrices : UserStatusType.LegalPrices);
                //setStatus(status === UserStatusType.NoLegalNoPrices ? UserStatusType.NoLegalPrices : UserStatusType.LegalPrices);

            } else if (res && 'response' in res ) {
                //error
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    }



    return (
        <>
            <LeadTutorialStep stepData={leadTutorialInfo.step3} />
            <LeadTutorialStep stepData={leadTutorialInfo.step4} />
            <div className={`card prices-info`}>

                <div className={`prices-info-wrapper`}>
                    {showPrices ? curPrices ? (
                        <PricesBlock prices={curPrices} />
                    ) : null : <Button onClick={()=>setShowNDA(true)}>Explore our pricing options</Button>}
                </div>


                {showNDA ? (
                    <Modal title={`To access our pricing, kindly sign the Non-Disclosure Agreement (NDA).`} onClose={()=>setShowNDA(false)} >
                        <NDA handleSignNDA={handleSignNDA} />
                    </Modal>
                ) : null}
            </div>
        </>
    );
};

export default Prices;
