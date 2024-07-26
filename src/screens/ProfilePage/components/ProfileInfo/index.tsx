import React, {useState} from "react";

import "./styles.scss";
import useAuth from "@/context/authContext";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import ChangePasswordBlock from "./ChangePasswordBlock";
import {useTranslations} from "next-intl";

const ProfileInfo: React.FC = () => {
    const t = useTranslations('Profile.profileTab');

    const {userInfo} = useAuth();
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    return (
        <div className={`profile-info`}>
            <div className={`profile-info__wrapper`}>
                <div className='profile-info__user-avatar'>
                    <Icon name='profile'/>
                    <div className='profile-info__change-password'>
                        <Button onClick={() => setShowPasswordModal(true)}>{t('changePassword')}</Button>
                    </div>
                </div>
                <div className='profile-info__user-info'>
                    <div className='profile-info__user-info--user'>
                        <p className='profile-info__user-info--manager-title'>Credentials</p>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">{t('client')}:</div>
                            <div className="profile-info__user-info--value">{userInfo?.client}</div>
                        </div>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">{t('name')}:</div>
                            <div className="profile-info__user-info--value">{userInfo?.userName}</div>
                        </div>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">{t('email')}:</div>
                            <div className="profile-info__user-info--value">{userInfo?.userLogin}</div>
                        </div>
                    </div>
                    <div className='profile-info__user-info--managers'>
                    <div className='profile-info__user-info--manager'>
                            <p className='profile-info__user-info--manager-title'>{t('supportManager')}</p>
                            <div className='profile-info__user-info--row'>
                                <div className="profile-info__user-info--title">{t('name')}:</div>
                                <div className="profile-info__user-info--value">{userInfo?.supportManager?.name}</div>
                            </div>
                            <div className='profile-info__user-info--row'>
                                <div className="profile-info__user-info--title">{t('email')}:</div>
                                <div className="profile-info__user-info--value">
                                    <a className='is-link' href={`mailto:${userInfo?.supportManager?.email}`}>{userInfo?.supportManager?.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {showPasswordModal ?
                    <Modal title={t('changePassword')} onClose={() => setShowPasswordModal(false)}>
                        <ChangePasswordBlock onClose={() => setShowPasswordModal(false)}/>
                    </Modal>
                    : null
                }
            </div>
        </div>
    );
};

export default ProfileInfo;
