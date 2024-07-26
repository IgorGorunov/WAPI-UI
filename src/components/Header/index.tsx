import React, {useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Navigation from "@/components/Navigation";
import HeaderNotifications from "@/components/HeaderNotifications";
import useTourGuide from "@/context/tourGuideContext";
import ProfileDropdown from "@/components/ProfileDropdown";
import useNotifications from "@/context/notificationContext";
import {
    NOTIFICATION_OBJECT_TYPES,
    NOTIFICATION_STATUSES,
    NOTIFICATION_TYPES,
    NotificationType
} from "@/types/notifications";
import {getNotificationIconName} from "@/components/HeaderNotifications/NotificationsBlock";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import LanguageSwitcher from "../LanguageSelector";
import SingleDocument from "@/components/SingleDocument";

type HeaderType = {
    pageTitle?: string;
    toRight?: boolean;
    needTutorialBtn?: boolean;
    children?: React.ReactNode;
    noMenu?: boolean;
    needNotifications?: boolean;
}

const Header: React.FC<HeaderType> = ({pageTitle, toRight = false, children, needTutorialBtn=false, noMenu=false, needNotifications=true}) => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleClick = () => {
        setMenuOpen(!isMenuOpen);
    }

    const {runTour, setRunTour} = useTourGuide();

    const {notifications} = useNotifications();
    const {setNotificationAsRead} = useMarkNotificationAsRead();
    const handleMarkAsRead = (uuid) => {
        setNotificationAsRead(uuid);
    }

    const [docUuid, setDocUuid] = useState<string|null>(null);
    const [docType, setDocType] = useState<NOTIFICATION_OBJECT_TYPES|null>(null);

    const onNotifiedDocClose = () => {
        setDocType(null);
        setDocUuid(null);
    }

    const handleNotificationClick = (notification: NotificationType) => {
        if (notification.objectType && notification.objectUuid) {
            if (notification.objectType) {
                // const curDoc = NOTIFICATION_OBJECT_TYPES[notification.objectType];
                // Router.push(`${curDoc}?uuid=${notification.objectUuid}`);
                setDocType(NOTIFICATION_OBJECT_TYPES[notification.objectType]);
                setDocUuid(notification.objectUuid);
            }

        }
    }

    return (
        <div className={`main-header`}>
            {/*<LanguageSwitcher />*/}
            <div className='main-header__wrapper card'>
                <div className='main-header__menu-block' onClick={handleClick}>
                    {!noMenu && <div className='main-header__icon'>
                        <Icon name={"burger"}/>
                    </div>}
                    <div className={`page-title ${noMenu ? 'no-margin' : ''}`}><h2>{pageTitle}</h2></div>
                </div>

                <div className={`main-header__components ${toRight ? "align-right" : ""}`}>
                    {children}
                </div>

                <div className='main-header__user-block'>
                    <ProfileDropdown />
                    {needTutorialBtn ?
                        <button className={`tour-guide ${runTour ? 'is-active' : ''}`} onClick={()=>setRunTour(!runTour)}><Icon name='book' /></button>
                        : null}
                    {needNotifications ? <div className='main-header__notifications'>
                        <HeaderNotifications />
                    </div> : null}
                </div>
            </div>

            {/*urgent notifications*/}
            <ul className='main-header__urgent-notifications-list'>
                {notifications && notifications.length ?
                    notifications.filter(item => item.type === NOTIFICATION_TYPES.URGENT && item.status !== NOTIFICATION_STATUSES.READ).map(item => (
                        <li key={item.uuid} className={`card main-header__urgent-notifications-list-item ${item.objectUuid ? 'is-clickable' : ''}`} onClick={()=>handleNotificationClick(item)}>
                            <Icon className='main-header__urgent-notifications-list-item--icon' name={getNotificationIconName(item.type)} />
                            <p className='main-header__urgent-notifications-list-item--title'>{item.title}</p>
                            <p className='main-header__urgent-notifications-list-item--text'>{item.message}</p>
                            <a href="#" className='main-header__urgent-notifications-list-item--close' onClick={()=>handleMarkAsRead(item.uuid)}><Icon name='close' /></a>
                        </li>
                    ))
                    : null}
            </ul>

            <Navigation isMenuOpen={isMenuOpen} handleClose={()=>setMenuOpen(false)}/>

            { docUuid && docType ? <SingleDocument type={docType} uuid={docUuid} onClose={onNotifiedDocClose} /> : null}
        </div>
    );
};

export default Header;
