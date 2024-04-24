import React, {useEffect, useRef, useState} from 'react';
import './styles.scss'
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import Router from "next/router";
import useOutsideClick from "@/hooks/useOutsideClick";

const ProfileDropdown = () => {
    const { getUserName, logout, userStatus } = useAuth();

    const [curUserName, setCurUserName] = useState<string|null|undefined>("");
    //const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setCurUserName(getUserName());
    }, []);

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOutsideClick(dropdownRef, ()=>setIsOpen(false));

    const handleOpenProfile = async () => {
        await Router.push(Routes.Profile);
    }


    const handleLogOut = async() => {
        logout();
        await Router.push(Routes.Login);
    }

    return (
        <div className="profile-dropdown" ref={dropdownRef}>
            {userStatus == 'user' ?
                <>
                    <button className='profile-dropdown__user card' onClick={() => setIsOpen(!isOpen)}>
                        <Icon name='user'/>
                        <span className='user-name'>{curUserName}</span>
                    </button>
                    {isOpen && (
                        <ul className="profile-dropdown__menu card">
                            <li key='profile' className="profile-dropdown__menu-item"> <button className="profile-dropdown__menu-item-btn" onClick={handleOpenProfile}><Icon name='profile' /> Profile</button></li>
                            <li key='logout' className="profile-dropdown__menu-item"><button className="profile-dropdown__menu-item-btn" onClick={handleLogOut}><Icon name='exit' /> Log out</button></li>
                        </ul>
                    )}
                </>
                : <div className='profile-dropdown__user card' onClick={handleLogOut}>
                    <span className='user-name'>{curUserName}</span>
                    <Icon name='exit'/>
                </div>
            }
        </div>
    );
};

export default ProfileDropdown;