import React, {useEffect, useState} from "react";
import "./styles.scss";
import Icon, {IconType} from "@/components/Icon";
import {
    NOTIFICATION_OBJECT_TYPES,
    NOTIFICATION_STATUSES,
    NOTIFICATION_TYPES,
    NotificationType
} from "@/types/notifications";
import ModalStatus, {ModalStatusType} from "@/components/ModalStatus";
import {STATUS_MODAL_TYPES} from "@/types/utility";
import SearchField from "@/components/SearchField";
import SearchContainer from "@/components/SearchContainer";
import {formatDateTimeToStringWithDotWithoutSeconds} from "@/utils/date";
import {useMarkNotificationAsRead} from "@/hooks/useMarkNotificationAsRead";
import useNotifications from "@/context/notificationContext";
import ConfirmModal from "@/components/ModalConfirm";
import FieldBuilder from "@/components/FormBuilder/FieldBuilder";
import {FormFieldTypes} from "@/types/forms";
import SingleDocument from "@/components/SingleDocument";

const formatMessage = (messageText: string, messageLength = 50) => {
    if (messageText.length > messageLength) {
        return messageText.substring(0,messageLength)+'...';
    }
    return messageText;
}

export const getNotificationIconName = (notificationType: NOTIFICATION_TYPES) => {
    switch (notificationType) {
        case NOTIFICATION_TYPES.INFO :
            return 'info';
        case NOTIFICATION_TYPES.ERROR :
            return 'error';
        case NOTIFICATION_TYPES.IMPORTANT :
            return 'warning';
        case NOTIFICATION_TYPES.URGENT :
            return 'lightning-bolt';
        default:
            return 'info';
    }
}


type NotificationsBlockPropsType = {
    notificationsList: NotificationType[];
    isNotificationsBlockOpen: boolean;
    onClose: ()=>void;
}

const NotificationsBlock: React.FC<NotificationsBlockPropsType> = ({notificationsList, isNotificationsBlockOpen, onClose}) => {
    const {setNotificationAsRead, setNotificationAsUnread} = useMarkNotificationAsRead();
    const {newNotifications} = useNotifications();

    const [showNotificationModal, setShowNotificationModal] = useState(false);
    const closeNotificationModal = () => {
        setShowNotificationModal(false);
    }
    const [modalStatusInfo, setModalStatusInfo] = useState<ModalStatusType>({statusModalType: STATUS_MODAL_TYPES.NOTIFICATION, onClose: ()=>setShowNotificationModal(false)})

    //load more notifications
    const notificationsPerLoad = 20;
    const [notificationsLoaded, setNotificationsLoaded] = useState(notificationsPerLoad);
    const handleLoadMore = () => {
        setNotificationsLoaded(prevState => prevState + notificationsPerLoad);
    }

    const [docUuid, setDocUuid] = useState<string|null>(null);
    const [docType, setDocType] = useState<NOTIFICATION_OBJECT_TYPES|null>(null);


    const onNotifiedDocClose = () => {
        setDocType(null);
        setDocUuid(null);
    }
    const handleNotificationClick = (notification: NotificationType) => {
        onClose();
        if (notification.objectType && notification.objectUuid) {
            if (notification.objectType) {
                // const curDoc = NOTIFICATION_OBJECT_TYPES[notification.objectType];
                // Router.push(`${curDoc}?uuid=${notification.objectUuid}`);
                setDocType(NOTIFICATION_OBJECT_TYPES[notification.objectType]);
                setDocUuid(notification.objectUuid);
            }

        } else {
            //open info modal
            setModalStatusInfo({
                statusModalType: notification.type === NOTIFICATION_TYPES.INFO ? STATUS_MODAL_TYPES.NOTIFICATION : STATUS_MODAL_TYPES.ERROR,
                title: "Notification",
                subtitle: notification.message,
                //subtitle: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
                onClose: closeNotificationModal
            })
            setShowNotificationModal(true);
            setNotificationAsRead(notification.uuid);
        }
    }

    const setAllNotificationsAsRead = () => {
        //notificationsList.map(item => {
            setNotificationAsRead('');
        //})
    }
    const handleToggleStatus = (notification: NotificationType) => {
        if (notification.status === NOTIFICATION_STATUSES.READ) {
            setNotificationAsUnread(notification.uuid);
        } else {
            setNotificationAsRead(notification.uuid)
        }
    }


    const [filteredNotifications, setFilteredNotifications] = useState(notificationsList);

    //search
    const [searchTermNotifications, setSearchTermNotifications] = useState('');

    const handleFilterChange = (newSearchTerm :string) => {
        setSearchTermNotifications(newSearchTerm);
    };

    //toggle only unread
    const [onlyUnread, setOnlyUnread] = useState(false);
    const onlyUnreadField = {
        fieldType: FormFieldTypes.TOGGLE,
        name: 'onlyUnread',
        label: 'Unread',
        checked: onlyUnread,
        onChange: ()=>{setOnlyUnread(prevState => !prevState)},
        hideTextOnMobile: true,
    }

    //confirm set all to read
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const handleConfirmAllToRead = () => {
        setShowConfirmModal(false);
        setAllNotificationsAsRead();
    }

    const handleCancelAllToRead = () => {
        setShowConfirmModal(false);
    }

    useEffect(() => {
        //search
        const filterNotifications = notificationsList.filter(notification => {
            const matchesSearch = !searchTermNotifications.trim() || Object.keys(notification).some(key => {
                const value = notification[key];
                if (key !== 'uuid' && key !== 'objectUuid') {
                    const stringValue = typeof value === 'string' ? value.toLowerCase() : String(value).toLowerCase();
                    const searchTermsArray = searchTermNotifications.trim().toLowerCase().split(' ');
                    return searchTermsArray.every(word => stringValue.includes(word));
                }
                return false;
            });

            const matchesUnreadFilter = !onlyUnread || notification.status !==NOTIFICATION_STATUSES.READ;

            return matchesSearch && matchesUnreadFilter;
        });

        setFilteredNotifications(filterNotifications);

    }, [searchTermNotifications, notificationsList, newNotifications, onlyUnread]);



    return (
        <div className={`notifications-block__overlay ${isNotificationsBlockOpen ? 'notifications-block__overlay-open' : ''}`} onClick={onClose}>
            <div className={`notifications-block ${isNotificationsBlockOpen ? 'notifications-block--open' : ''}`} onClick={(e)=>e.stopPropagation()}>
                <div className={`notifications-block__wrapper`}>
                    <button className="close-button" onClick={onClose}>
                        <Icon name="close" style={{width: "30px", height: "30px"}}/>
                    </button>
                    {/*clear all*/}
                    <div className='filter-and-clear-all'>
                        <FieldBuilder {...onlyUnreadField} />
                        <button
                                className='notifications-block__clear-all'
                                onClick={()=>setShowConfirmModal(true)}
                            >Set all notifications as read
                        </button>

                    </div>
                    {/* search */}
                    <div className='notifications-block__search'>

                        <SearchContainer>
                            <SearchField searchTerm={searchTermNotifications} handleChange={handleFilterChange} handleClear={()=>{setSearchTermNotifications(""); handleFilterChange("");}} />
                            {/*<FieldBuilder {...fullTextSearchField} />*/}
                        </SearchContainer>
                    </div>

                    {/*  notifications  */}
                    <div className='notifications-block__notifications'>
                        <div className={`notifications-block__notifications-list-wrapper`} >
                            {filteredNotifications.length > 0 ? (
                                <>
                                    <ul className='notifications-block__notifications-list'>
                                        {filteredNotifications?.slice(0, notificationsLoaded)?.map(item => (
                                            <li key={item.uuid} className={`card notifications-block__notifications-list-item ${item.status === NOTIFICATION_STATUSES.READ ? 'read' : 'unread'} type-${item.type || 'Info'}`}>
                                                <button
                                                    className={`notifications-block__notifications-list-item-btn`}
                                                    onClick={() => handleNotificationClick(item)}>
                                                    <div className='notification-title'>{item.title ? item.title : formatMessage(item.message, 100)}</div>
                                                    <div className='notification-period'>{formatDateTimeToStringWithDotWithoutSeconds(item.period)}</div>
                                                    {item.topic || item.objectType===NOTIFICATION_OBJECT_TYPES.Ticket ? (
                                                            <div className='notification-topic'><span>Topic: </span>{item.topic}</div>)
                                                        : null
                                                    }
                                                    <div className='notification-message'> {formatMessage(item.message, 200)}</div>
                                                    <div className={`notification-icon type-${item.type}`}>
                                                        <Icon name={getNotificationIconName(item.type) as IconType} />
                                                    </div>
                                                </button>
                                                <button className={`notification-toggle-status-btn ${item.status === NOTIFICATION_STATUSES.READ ? 'is-read' : 'is-unread'} type-${item.type}`} onClick={()=>handleToggleStatus(item)} />
                                            </li>
                                        ))}
                                    </ul>
                                    {notificationsLoaded < filteredNotifications?.length && (
                                        <button
                                            className="notifications-block__notifications-load-more-btn"
                                            onClick={handleLoadMore}
                                        >
                                            Load more
                                        </button>
                                    )}
                                </>
                            ) : <div className='no-notifications'>
                                No notifications
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {showNotificationModal && <ModalStatus {...modalStatusInfo} />}
            {showConfirmModal && <ConfirmModal
                actionText='set all notifications to read'
                onOk={handleConfirmAllToRead}
                onCancel={handleCancelAllToRead}
            />}
            { docUuid && docType ? <SingleDocument type={docType} uuid={docUuid} onClose={onNotifiedDocClose} /> : null}
        </div>
    );
};

export default NotificationsBlock;
