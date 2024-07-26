import React, {useCallback, useRef, useState} from 'react';
import './styles.scss'
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import Router from "next/router";
import useOutsideClick from "@/hooks/useOutsideClick";
import Modal from "@/components/Modal";
import UserList, {UserType} from "@/components/ProfileDropdown/UserList";
import {ApiResponseType} from "@/types/api";
import {getUserList} from "@/services/auth";
import Loader from "@/components/Loader";
import {useTranslations} from "next-intl";

const ProfileDropdown = () => {
    const t = useTranslations('profileDropdown');

    const { token, userName, logout, userStatus, superUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [users, setUsers] = useState<UserType[] | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOutsideClick(dropdownRef, ()=>setIsOpen(false));

    const fetchUsers = useCallback(async()=> {
        try {
            setIsLoading(true);

            const res: ApiResponseType = await getUserList({token}
            );

            if (res && "data" in res) {
                setUsers(res.data);
            } else {
                console.error("API did not return expected data");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    },[token] );


    const handleOpenProfile = async () => {
        await Router.push(Routes.Profile);
    }


    const handleLogOut = async() => {
        await Router.push(Routes.Login);
        logout();
    }

    const handleUserList = () => {
        fetchUsers();
        setShowUserList(true);
    }

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            {isLoading && <Loader />}
            {userStatus == 'user' ?
                <>
                    <button className='profile-dropdown__user card' onClick={() => setIsOpen(!isOpen)}>
                        {superUser ? <Icon name='admin'/> : <Icon name='user'/>}
                        <span className='user-name'>{userName}</span>
                    </button>
                    {isOpen && (
                        <ul className="profile-dropdown__menu card">
                            <li key='profile' className="profile-dropdown__menu-item"> <button className="profile-dropdown__menu-item-btn" onClick={handleOpenProfile}><Icon name='profile' />{t('profile')}</button></li>
                            {superUser ? <li key='user-list' className="profile-dropdown__menu-item">
                                <button className="profile-dropdown__menu-item-btn" onClick={handleUserList}>
                                    <Icon name='lines'/>
                                    {t('switchUser')}
                                </button>
                            </li> : null}
                            <li key='logout' className="profile-dropdown__menu-item">
                                <button className="profile-dropdown__menu-item-btn" onClick={handleLogOut}><Icon name='exit' /> {t('logOut')}</button></li>
                        </ul>
                    )}
                </>
                : <>
                    {userStatus ? <div className='profile-dropdown__user card' onClick={handleLogOut}>
                        <span className='user-name'>{userName}</span>
                        <Icon name='exit'/>
                    </div> : null}
                </>
            }
            {showUserList && users && users.length &&
                <Modal title="Clients" onClose={()=>setShowUserList(false)}>
                    <UserList users={users} onClose={()=>{setShowUserList(false); setIsOpen(false)}}/>
                </Modal>
            }
        </div>
    );
};

export default ProfileDropdown;