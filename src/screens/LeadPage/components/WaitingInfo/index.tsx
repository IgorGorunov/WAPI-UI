import React from "react";
import "./styles.scss";
import useAuth from "@/context/authContext";
import {UserStatusType} from "@/types/leads";
import {useTranslations} from "next-intl";

const WaitingInfo = () => {
    const t = useTranslations('LeadPage.waitingInfo')
    const { getTextInfo, userStatus } = useAuth();

    return (
        <div className={`card lead-page__waiting-info`}>
            {/*<p>{getTextInfo() || 'Your request is being processed. Confirmation will be sent to your email...'}</p>*/}

            {userStatus === UserStatusType.Waiting ? <div className='lead-page__waiting-info__message'>
                <p className='lead-page__waiting-info__message-title'>{t('title1')}<br/> {t('title2')}</p>

                <div className='lead-page__waiting-info__message-text-wrapper'>
                    <p className='lead-page__waiting-info__message-text-title'>{t('subtitle')}</p>
                    <p className='lead-page__waiting-info__message-text'><span className='waiting-step text-bold'>{t('step')} 1:</span> {t('step1')}</p>
                    <p className='lead-page__waiting-info__message-text'><span
                        className='waiting-step text-bold'>{t('step')} 2:</span> {t('step2')}</p>
                    <p className='lead-page__waiting-info__message-text'><span
                        className='waiting-step text-bold'>{t('step')} 3:</span> {t('step3')}
                    </p>
                </div>
            </div> : <p className={'lead-page__waiting-info--rejected'}>{getTextInfo() || t('rejected')}</p>}
        </div>
    );
};

export default WaitingInfo;
