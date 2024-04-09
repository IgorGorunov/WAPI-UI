import React, {useCallback, useEffect, useState} from "react";
import "./styles.scss";
import Tabs from "@/components/Tabs";
import LegalInfo from "./LegalInfo";
import Prices from "./Prices";
import {LegalInfoFormType, UserStatusType} from "@/types/leads";
import Icon from "@/components/Icon";
import {ApiResponseType} from "@/types/api";
import {getLegalData} from "@/services/leads";
import useAuth from "@/context/authContext";

type ApprovedLeadInfoPropsType = {
    // status: UserStatusType;
    // setStatus: (status: UserStatusType)=>void
}

const ApprovedLeadInfo: React.FC<ApprovedLeadInfoPropsType> = () => {

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

    const noLegal = userStatus === UserStatusType.NoLegalPrices || userStatus === UserStatusType.NoLegalNoPrices;

    useEffect(()=>{
       fetchLegalData();
    }, [userStatus]);

    const tabTitles = ['Prices', 'Legal documentation', 'API info', 'UI tutorial'].map(item=>({title: item}));

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
                    <div className='api-documentation__container'>
                        <a href='https://github.com/wapicom/API/wiki/Documentation-for-integration-with-the-WAPI-system-via-the-API' target='_blank' className='api-documentation__link'><Icon name='api-documentation' />Explore our API documentation here.</a>
                    </div>
                </div>
                <div key='ui-tab' className='lead-page-tab'>
                    UI
                </div>
            </Tabs>
        </div>
    );
};

export default ApprovedLeadInfo;
