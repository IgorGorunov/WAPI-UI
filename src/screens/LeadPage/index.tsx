import React, {useCallback, useEffect, useState} from "react";
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import Layout from "@/components/Layout/Layout";
import "./styles.scss";
import Loader from "@/components/Loader";
import {checkLeadStatus, getLeadParameters} from "@/services/leads";
import {ApiResponseType} from "@/types/api";
import {QuestionnaireParamsType, UserStatusType} from "@/types/leads";
import Questionnaire from "./components/Questionnaire";
import Header from "@/components/Header";
import WaitingInfo from "@/screens/LeadPage/components/WaitingInfo";
import ApprovedLeadInfo from "@/screens/LeadPage/components/ApprovedLeadInfo";
import {Routes} from "@/types/routes";
import useTourGuide from "@/context/tourGuideContext";
import {TourGuidePages} from "@/types/tourGuide";
import TourGuide from "@/components/TourGuide";
import {tourGuideStepsLeads} from "@/screens/LeadPage/leadPageTourGuideSteps.constants";
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";

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
    const { tenantData } = useTenant();
    const alias = tenantData?.alias || null;
    const {token, getToken, userStatus, setUserStatus, logout} = useAuth();
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

    useEffect(() => {
        //check user status
        const fetchStatus = async() => {
            try {
                setIsLoading(true);

                const res: ApiResponseType = await checkLeadStatus({lead: token, alias});

                if (res && "data" in res) {
                    setUserStatus(res.data?.userStatus);
                } else {
                    console.error("API did not return expected data");
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStatus();

    }, []);

    const fetchLeadParams = useCallback(async () => {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getLeadParameters({token, alias});

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
        }
    }, []);

    const [show, setShow] = useState(false);
    useEffect(() => {
        setShow(true);
    }, []);

    const isLeadApproved = (userStatus === UserStatusType.NoLegalNoPrices || userStatus === UserStatusType.LegalPrices
        || userStatus === UserStatusType.LegalNoPrices || userStatus === UserStatusType.NoLegalPrices);

    //tour guide
    const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

    useEffect(() => {
        if (!isTutorialWatched(TourGuidePages.Lead)) {
            if (!isLoading && isLeadApproved ) {
                setTimeout(() => setRunTour(true), 1000);
            }
        }
    }, [isLoading, userStatus]);

    return (
        <Layout hasHeader hasFooter>
            <SeoHead title='Registration page' description='' />
            {show && <div className="page-component lead-page lead-page__container">
                {isLoading && <Loader/>}
                <Header pageTitle={getHeaderTitle(userStatus)} toRight needTutorialBtn  />

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
            {isLeadApproved && runTour && tourGuideStepsLeads ? <TourGuide steps={tourGuideStepsLeads} run={runTour} pageName={TourGuidePages.Lead} /> : null}
        </Layout>
    )
}

export default LeadPage;