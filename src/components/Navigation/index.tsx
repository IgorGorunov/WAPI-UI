import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import SubmenuBlock, {SubmenuBlockType} from "@/components/Navigation/SubmenuBlock";
import {navBlocks} from "@/components/Navigation/navItems.constants";
import './styles.scss'
import SubmenuSingleItem from "@/components/Navigation/SubmenuSingleItem";
import useTourGuide from "@/context/tourGuideContext";
import {navigationStepsFull} from "./navigationTourGuideSteps.constants";
import TourGuide from "@/components/TourGuide";
import {TourGuidePages} from "@/types/tourGuide";
import useAuth from "@/context/authContext";
import useNotifications from "@/context/notificationContext";
import {NOTIFICATION_OBJECT_TYPES, NOTIFICATION_STATUSES, NotificationType} from "@/types/notifications";

type NavigationType = {
    isMenuOpen: boolean;
    handleClose: ()=>void;
}

const getTicketsWithUnreadMessages = (notifications: NotificationType[]) => {
    if (!notifications) {
        return 0;
    }

    const res = notifications.filter(item => item.objectType === 'Ticket' as NOTIFICATION_OBJECT_TYPES && item.status !== NOTIFICATION_STATUSES.READ).map(item => item.objectUuid);
    const uniqueTickets = new Set(res);

    return uniqueTickets.size;
}

const Navigation: React.FC<NavigationType> = ({isMenuOpen, handleClose}) => {
    const {isNavItemAccessible} = useAuth();
    const {notifications} = useNotifications();
    const [amountOfTicketsWithUnreadMessages, setAmountOfTicketsWithUnreadMessages] = useState(getTicketsWithUnreadMessages(notifications));

    useEffect(() => {
        setAmountOfTicketsWithUnreadMessages(getTicketsWithUnreadMessages(notifications))
    }, [notifications]);

    //tour guide
    const {isNavigationWatched} = useTourGuide();
    const [runNavigationTour, setRunNavigationTour] = useState(false);

    const navigationSteps = [];
    navigationStepsFull.forEach(item => {
        if (item.submenuName === 'Dashboard' || isNavItemAccessible(item.submenuName)) {
            navigationSteps.push(item);
        }
    } )

    useEffect(() => {
        if (isMenuOpen && !isNavigationWatched()) {
            setTimeout(() => setRunNavigationTour(true), 1000);

        }
    }, [isMenuOpen]);

    const handleCloseClick = useCallback(() => {
        if (!runNavigationTour) {
            handleClose();
        }
    },[runNavigationTour]);

    const navBlocksArray = useMemo(()=>navBlocks(amountOfTicketsWithUnreadMessages) as SubmenuBlockType[],[amountOfTicketsWithUnreadMessages]);


    return (
        <div className={`burger-menu__overlay ${isMenuOpen ? 'burger-menu__overlay-open' : ''}`} onClick={handleCloseClick}>
            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`} onClick={(e)=>e.stopPropagation()}>
                <div className={`burger-menu-child`}>
                    <button className="close-button" onClick={handleClose}>
                        <Icon name="close" style={{width: "30px", height: "30px"}} />
                    </button>
                    <div className='dashboard-menu-link'>
                        <Link href="/" className="button-link" passHref onClick={handleClose}>
                            <Icon name="home" className="icon-home"/>
                            <span style={{marginLeft: "20px"}}>Dashboard</span>
                        </Link>
                    </div>
                    {navBlocksArray && navBlocksArray.length ? navBlocksArray.map((navBlock, index)=> (
                        (isNavItemAccessible(navBlock.submenuName)) ? (<div key={`${navBlock.submenuTitle}-${index}`}>
                            {navBlock.submenuLink && !navBlock.navItems.length ?
                                <SubmenuSingleItem {...navBlock}/>
                                :
                                <SubmenuBlock {...navBlock} handleClose={handleClose} />
                            }
                        </div>) : null
                    ))  : null}
                </div>
            </div>
            {isMenuOpen && runNavigationTour && navigationSteps ? <TourGuide steps={navigationSteps} run={runNavigationTour} setRunTourOpt={setRunNavigationTour} pageName={TourGuidePages.Navigation} disableAnimation={true} /> : null}
        </div>
    )
}

export default Navigation;