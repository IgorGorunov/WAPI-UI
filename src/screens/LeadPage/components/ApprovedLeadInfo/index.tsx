import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import Tabs from "@/components/Tabs";
import LegalInfo from "./LegalInfo";
import Prices from "./Prices";
import {LegalInfoFormType} from "@/types/leads";
import {ApiResponseType} from "@/types/api";
import {getLegalData} from "@/services/leads";
import useAuth from "@/context/authContext";
import ApiInfo from "@/screens/LeadPage/components/ApprovedLeadInfo/ApiInfo";
import {useTranslations} from "next-intl";

type ApprovedLeadInfoPropsType = {

}

const ApprovedLeadInfo: React.FC<ApprovedLeadInfoPropsType> = () => {
    const t = useTranslations('LeadPage.approvedLeadInfo.tabs')
    const {token, userStatus} = useAuth();
    const [legalData, setLegalData] = useState<null|LegalInfoFormType>(null);

    const fetchLegalData = useCallback(async () => {
        try {
            const res: ApiResponseType = await getLegalData({token: token});

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

    const tabTitles = [t('prices'), t('legalInfo'), t('api')].map(item=>({title: item}));

    return (
        <div className={`card lead-page__approved-block `}>
            <Tabs id='order-tabs' tabTitles={tabTitles}>
                <div key='prices-tab' className='lead-page-tab'>
                    <Prices />
                </div>
                <div key='legal-tab' className='lead-page-tab'>
                    {legalData ? <LegalInfo legalData={legalData}/> : null }
                </div>
                <div key='api-tab' className='lead-page-tab'>
                    <ApiInfo />
                </div>
                {/*<div key='ui-tab' className='lead-page-tab'>*/}
                {/*    UI*/}
                {/*</div>*/}
            </Tabs>
        </div>
    );
};

export default ApprovedLeadInfo;
