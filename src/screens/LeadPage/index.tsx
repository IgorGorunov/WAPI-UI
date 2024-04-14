import React, {useCallback, useEffect, useState} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Loader from "@/components/Loader";
import {getLeadParameters} from "@/services/leads";
import {ApiResponseType} from "@/types/api";
import {QuestionnaireParamsType, UserStatusType} from "@/types/leads";
import Questionnaire from "./components/Questionnaire";
import Header from "@/components/Header";
import WaitingInfo from "@/screens/LeadPage/components/WaitingInfo";
import ApprovedLeadInfo from "@/screens/LeadPage/components/ApprovedLeadInfo";
import {Routes} from "@/types/routes";

const getHeaderTitle = (userStatus: string) => {
    switch (userStatus) {
        case UserStatusType.Questionnaire:
            return 'Feedback form';
        case UserStatusType.Waiting:
            return 'Data is currently under review';
        case UserStatusType.LegalNoPrices:
            return 'Agreement';
        case UserStatusType.NoLegalPrices:
            return 'Agreement';
        case UserStatusType.LegalPrices:
            return 'Agreement';
        case UserStatusType.NoLegalNoPrices:
            return 'Agreement';
        case UserStatusType.Rejected:
            return '';
        default:
            return 'Required info';
    }
}

const LeadPage = () => {
    const {token, getToken, userStatus, logout} = useAuth();
    //const [curStatus, setCurStatus] = useState(getUserStatus() as UserStatusType);
    const Router = useRouter();

    useEffect(() => {
        if (!getToken()) {
            setShow(false);
            logout();
            Router.push(Routes.Login);
        }
    }, [token]);

    const [questionnaireParams, setQuestionnaireParams] = useState<QuestionnaireParamsType | null>(null);

    const [isLoading, setIsLoading] = useState(false);



    const fetchLeadParams = useCallback(async () => {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getLeadParameters();

            if (res && "data" in res) {
                setQuestionnaireParams(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[]);


    useEffect(() => {
        //get parameters
        if (userStatus === 'Questionnaire') {
            fetchLeadParams();
        // } else if (curStatus === 'Prices') {
        //     fetchPricesInfo();
        }
    }, []);

    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);

    return (
        <Layout hasHeader hasFooter>
            {show && <div className="page-component lead-page lead-page__container">
                {isLoading && <Loader/>}
                <Header pageTitle={getHeaderTitle(userStatus)} toRight noMenu needNotifications={false} />

                {userStatus === UserStatusType.Questionnaire && questionnaireParams ?
                    <div className={`lead-page__questionnaire`}>
                        <Questionnaire questionnaireParams={questionnaireParams}/>
                    </div>
                    : (userStatus === UserStatusType.NoLegalNoPrices || userStatus === UserStatusType.LegalPrices
                        || userStatus === UserStatusType.LegalNoPrices || userStatus === UserStatusType.NoLegalPrices) ?
                        <ApprovedLeadInfo />
                        : (userStatus === UserStatusType.Waiting || userStatus === UserStatusType.Rejected) ?
                            <WaitingInfo />
                            : <p>Sorry...</p>
                }

            </div>}

        </Layout>
    )
}

export default LeadPage;