import React, {
    createContext,
    PropsWithChildren,
    useContext, useEffect, useState,
} from "react";
import Cookie from "js-cookie";
import {TourGuidePages} from "@/types/tourGuide";
import {REPORT_TYPES} from "@/types/reports";
import useAuth from "@/context/authContext";

type tourGuideContextType = {
    runTour: boolean;
    setRunTour: (val: boolean)=>void;
    isTutorialWatched: (page: string)=>boolean;
    setTutorialAsWatched: (page: string)=>void;
    isNavigationWatched: ()=>boolean;
    isReportWatched: (report: REPORT_TYPES)=>boolean;
};

const TourGuideContext = createContext<tourGuideContextType>({} as tourGuideContextType);

const useTourGuide = (): tourGuideContextType => {
    return useContext(TourGuideContext);
};

export const TourGuideProvider = (props: PropsWithChildren) => {
    const [watchedPages, setWatchedPages] = useState( Cookie.get('tutorialData') ? Cookie.get('tutorialData').split(';') : [])
    const [runTour, setRunTour] = useState(false);

    const {token, superUser} = useAuth();

    useEffect(() => {
        setWatchedPages(Cookie.get('tutorialData') ? Cookie.get('tutorialData').split(';') : []);
    }, [token]);

    const isTutorialWatched = (page: string) => {
        if (superUser) {
            return true;
        }

        if (page === 'Lead') {
            return isLeadTutorialWatched();
        }

        return watchedPages.filter(item => item==page).length > 0;
    }

    const setTutorialAsWatched = (page: TourGuidePages) => {
        if (page === 'Lead') {
            setLeadTutorialAsWatched();
        } else if (!isTutorialWatched(page)) {
            const tutorialCookieData = Cookie.get('tutorialData');
            if (tutorialCookieData) {
                Cookie.set('tutorialData', watchedPages.filter(item=>item!==page).join(';') + ';' + page);
            } else {
                Cookie.set('tutorialData', page);
            }
            setWatchedPages(prevState => [...prevState.filter(item=>item!==page), page]);
        }
    }

    const isNavigationWatched = () => {
        if (superUser) {
            return true;
        }

        return watchedPages.length > 1 || watchedPages.filter(item => item===TourGuidePages.Navigation).length > 0;
    }

    const isReportWatched = (report: REPORT_TYPES) => {
        const tourGuidePageForReport = TourGuidePages[`Report_${report}`];

        if (watchedPages && tourGuidePageForReport) {
            return watchedPages.filter(item => item==tourGuidePageForReport).length > 0;
        }

        return false;
    }

    const isLeadTutorialWatched = () => {
        return !!Cookie.get('WAPI_lead_tutorial');
    }
    const setLeadTutorialAsWatched = () => {
        Cookie.set('WAPI_lead_tutorial', 'true', {expires: 30});
    }

    return (
        <TourGuideContext.Provider value={{
            runTour, setRunTour, isTutorialWatched, setTutorialAsWatched, isNavigationWatched, isReportWatched
        }}>
            {props.children}
        </TourGuideContext.Provider>
    );
};

export default useTourGuide;