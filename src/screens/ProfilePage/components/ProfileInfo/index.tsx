import React, {useEffect, useState} from "react";

import "./styles.scss";
import useAuth, {AccessActions, AccessObjectTypes, USER_TYPES} from "@/context/authContext";
import Icon from "@/components/Icon";
import Button from "@/components/Button/Button";
import Modal from "@/components/Modal";
import ChangePasswordBlock from "./ChangePasswordBlock";

const ProfileInfo: React.FC = () => {

    const {userInfo, isActionIsAccessible, userType} = useAuth();

    console.log('userType in profile: ', userType, typeof userType, userType === USER_TYPES.SELLER)

    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

    useEffect(() => {
        setIsChangePasswordVisible(isActionIsAccessible(AccessObjectTypes["Profile/ChangePassword"], AccessActions.EditObject));
    }, [isActionIsAccessible]);

    // const handlePasswordChangeClick = () => {
    //     try {
    //         sendUserBrowserInfo({...getBrowserInfo('ChangePassword', AccessObjectTypes["Profile/ChangePassword"], AccessActions.EditObject), body: {}})
    //     } catch {}
    //     if (isActionIsAccessible(AccessObjectTypes["Profile/ChangePassword"], AccessActions.EditObject)) {
    //         setShowPasswordModal(true);
    //     }
    // }


    return (
        <div className={`profile-info`}>
            <div className={`profile-info__wrapper`}>
                <div className='profile-info__user-avatar'>
                    <Icon name='profile'/>
                    {isChangePasswordVisible ? <div className='profile-info__change-password'>
                        <Button onClick={()=>setShowPasswordModal(true)}>Change password</Button>
                    </div> : null}
                </div>
                <div className='profile-info__user-info'>
                    <div className='profile-info__user-info--user'>
                        <p className='profile-info__user-info--manager-title'>Credentials</p>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">Client:</div>
                            <div className="profile-info__user-info--value">{userInfo?.client}</div>
                        </div>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">Name:</div>
                            <div className="profile-info__user-info--value">{userInfo?.userName}</div>
                        </div>
                        <div className='profile-info__user-info--row'>
                            <div className="profile-info__user-info--title">E-mail:</div>
                            <div className="profile-info__user-info--value">{userInfo?.userLogin}</div>
                        </div>
                    </div>
                    {userType !== USER_TYPES.SELLER ? <div className='profile-info__user-info--managers'>
                        <div className='profile-info__user-info--manager'>
                            <p className='profile-info__user-info--manager-title'>Support manager</p>
                            <div className='profile-info__user-info--row'>
                                <div className="profile-info__user-info--title">Name</div>
                                <div className="profile-info__user-info--value">{userInfo?.supportManager?.name}</div>
                            </div>
                            <div className='profile-info__user-info--row'>
                                <div className="profile-info__user-info--title">E-mail:</div>
                                <div className="profile-info__user-info--value">
                                    <a className='is-link' href={`mailto:${userInfo?.supportManager?.email}`}>{userInfo?.supportManager?.email}</a>
                                </div>
                            </div>
                        </div>
                    </div> : null }
                </div>
                {showPasswordModal ?
                    <Modal title='Change password' onClose={() => setShowPasswordModal(false)}><ChangePasswordBlock
                        onClose={() => setShowPasswordModal(false)}/></Modal>
                    : null
                }
            </div>
        </div>
    );
};

export default ProfileInfo;
