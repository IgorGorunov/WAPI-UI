import React, {useCallback, useEffect, useState} from "react";
import styles from "./styles.module.scss";
import Tabs from "@/components/Tabs";
import LegalInfo from "./LegalInfo";
import Prices from "./Prices";
import {LegalInfoFormType} from "@/types/leads";
import {getLegalData} from "@/services/leads";
import useAuth from "@/context/authContext";
import ApiInfo from "@/screens/LeadPage/components/ApprovedLeadInfo/ApiInfo";
import Company from "@/screens/LeadPage/components/ApprovedLeadInfo/Company";
import NextStep from "@/screens/LeadPage/components/ApprovedLeadInfo/NextStep";
import NextButton from "@/screens/LeadPage/components/ApprovedLeadInfo/NextButton";
import AskManagerBtn from "@/screens/LeadPage/components/ApprovedLeadInfo/AskManagerBtn";
import useTenant from "@/context/tenantContext";

type ApprovedLeadInfoPropsType = {

}

const ApprovedLeadInfo: React.FC<ApprovedLeadInfoPropsType> = () => {
    const { tenantData } = useTenant();
    const alias = tenantData?.alias;
    const {token, userStatus} = useAuth();
    const [legalData, setLegalData] = useState<null|LegalInfoFormType>(null);

    const fetchLegalData = useCallback(async () => {
        try {
            const res = await getLegalData({token: token, alias});

            if (res && "data" in res) {
                setLegalData(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {

        }
    },[]);

    useEffect(()=>{
       fetchLegalData();
    }, [userStatus]);

    //const tabTitles = ['Prices', 'Legal documentation', 'API info', 'UI tutorial'].map(item=>({title: item}));

    const tabTitles = ['Company', 'Prices', 'Legal documentation', 'Integration', 'Next step'].map(item=>({title: item}));

    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className={`card ${styles['lead-page__approved-block']}`}>
            <Tabs id='lead-tabs' tabTitles={tabTitles} curTab={activeTab} needMinHeight={false} needMinHeightSmall={true} setCurTab={setActiveTab} needContentScroll={false}>
                <div key='company-tab' className={styles['lead-page-tab']}>
                    <Company />
                    <div className={styles['lead-page__approved-block__next-btn']}>
                        <AskManagerBtn />
                        <NextButton setActiveTab={setActiveTab} nextTab={1} />
                    </div>
                </div>
                <div key='prices-tab' className={styles['lead-page-tab']}>
                    <Prices/>
                    <div className={styles['lead-page__approved-block__next-btn']}>
                        <AskManagerBtn />
                        <NextButton setActiveTab={setActiveTab} nextTab={2}/>
                    </div>
                </div>
                <div key='legal-tab' className={styles['lead-page-tab']}>
                    <LegalInfo legalData={legalData}/>
                    <div className={styles['lead-page__approved-block__next-btn']}>
                        <AskManagerBtn />
                        <NextButton setActiveTab={setActiveTab} nextTab={3}/>
                    </div>
                </div>
                <div key='api-tab' className={styles['lead-page-tab']}>
                    <ApiInfo/>
                    <div className={styles['lead-page__approved-block__next-btn']}>
                        <AskManagerBtn />
                        <NextButton setActiveTab={setActiveTab} nextTab={4}/>
                    </div>
                </div>
                <div key='next-step-tab' className={styles['lead-page-tab']}>
                    <NextStep/>
                    <div className={styles['lead-page__approved-block__next-btn']}>
                        <AskManagerBtn/>
                    </div>
                </div>
                {/*<div key='ui-tab' className={styles['lead-page-tab']}>*/}
                {/*    UI*/}
                {/*</div>*/}
            </Tabs>
        </div>
    );
};

export default ApprovedLeadInfo;
