import Icon from "@/components/Icon";
import React from "react";
import styles from './styles.module.scss';

type MaintenancePropsType = {
    maintenanceMessages: string[];
    isLogin?: boolean;
}

const MaintenanceNotifications: React.FC<MaintenancePropsType> = ({maintenanceMessages, isLogin}) => {

    if (!maintenanceMessages || maintenanceMessages.length == 0) {
        return null;
    }

    return (
        <div className={`${styles['maintenance-message-container']} ${isLogin ? styles['is-login'] : ''}`} >
            {maintenanceMessages.map((message, idx) => (
                <div key={idx+(message || 'maintenance-message').slice(12).replace(' ', '_')}
                     className={`${styles['maintenance-message-wrapper']} ${idx < maintenanceMessages.length - 1 ? styles['maintenance-message-wrapper--has-other-below']: ''}`}
                     // style={{padding: '6px 16px', background:'#B91C1C', color: 'white', borderRadius:'9px', fontWeight:'bold', marginBottom: idx < maintenanceMessages.length - 1 ? '8px' : 0}}
                >
                    <span className={styles['maintenance-message-icon-wrapper']}>
                        <Icon name={'maintenance'} />
                    </span>
                    <p className={styles['maintenance-message-text']}>{message}</p>
                </div>
                // <div key={idx} style={{padding: '6px 16px', background:'#B91C1C', color: 'white', borderRadius:'9px', fontWeight:'bold', marginBottom: idx < futureMaintenanceMessages.length - 1 ? '8px' : 0}}>
                //     <span style={{width: '24px'}}><Icon name={'maintenance'} /></span>
                //     <p>{message}</p>
                // </div>
            ))}
        </div>



        // <div key={idx+message.slice(12).replace(' ', '_')}
        //      className={`${styles['maintenance-message-wrapper']} ${}`}
        //      style={{padding: '6px 16px', background:'#B91C1C', color: 'white', borderRadius:'9px', fontWeight:'bold', marginBottom: idx < messageLength - 1 ? '8px' : 0}}
        // >
        //     <span className={styles['maintenance-message-icon-wrapper']}>
        //         <Icon name={'maintenance'} />
        //     </span>
        //     <p className={styles['maintenance-message-text']}>{message}</p>
        // </div>
    )
}

export default MaintenanceNotifications;