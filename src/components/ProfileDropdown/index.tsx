import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.module.scss'
// Note: due to the number of classes we will just let it be global for now if it's too complex, wait, actually I must import it as styles and use it.
import styles from './styles.module.scss';
import Icon from "@/components/Icon";
import useAuth from "@/context/authContext";
import { Routes } from "@/types/routes";
import Router, { useRouter } from "next/router";
import useOutsideClick from "@/hooks/useOutsideClick";
import Modal from "@/components/Modal";
import UserList, { UserType } from "@/components/ProfileDropdown/UserList";
import { getUserList } from "@/services/auth";
import Loader from "@/components/Loader";
import useTenant from "@/context/tenantContext";

const ProfileDropdown = () => {
    const { token, userName, logout, userStatus, superUser } = useAuth();
    const { tenantData } = useTenant();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showUserList, setShowUserList] = useState(false);
    const [users, setUsers] = useState<UserType[] | null>(null);

    const [displayedName, setDisplayedName] = useState<string>('user');

    useEffect(() => {
        setDisplayedName(userName || 'user');
    }, [userName]);

    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);

    useOutsideClick(dropdownRef, () => setIsOpen(false));

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);

            const res = await getUserList({ token, alias: tenantData.alias }
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
    }, [token]);


    const handleOpenProfile = async () => {
        await Router.push(Routes.Profile);
    }


    const handleLogOut = async () => {
        logout();
        await Router.push(Routes.Login);
    }

    const handleUserList = () => {
        fetchUsers();
        setShowUserList(true);
    }

    return (
        <div className={styles["profile-dropdown"]} ref={dropdownRef}>
            {isLoading && <Loader />}
            {userStatus == 'user' ?
                <div>
                    <button className={`${styles['profile-dropdown__user']} card`} onClick={() => setIsOpen(!isOpen)}>
                        {superUser ? <Icon name='admin' /> : <Icon name='user' />}
                        <span className={styles['user-name']}>{displayedName}</span>
                    </button>
                    {isOpen ? (
                        <ul className={`${styles["profile-dropdown__menu"]} card`}>
                            <li key='profile' className={styles["profile-dropdown__menu-item"]}> <button className={styles["profile-dropdown__menu-item-btn"]} onClick={handleOpenProfile}><Icon name='profile' /> Profile</button></li>
                            {superUser ? <li key='user-list' className={styles["profile-dropdown__menu-item"]}>
                                <button className={styles["profile-dropdown__menu-item-btn"]} onClick={handleUserList}><Icon
                                    name='lines' />Switch user
                                </button>
                            </li> : null}
                            <li key='logout' className={styles["profile-dropdown__menu-item"]}>
                                <button className={styles["profile-dropdown__menu-item-btn"]} onClick={handleLogOut}><Icon name='exit' /> Log out</button></li>
                        </ul>
                    ) : null}
                </div>
                : <div>
                    {userStatus ? <div className={`${styles['profile-dropdown__user']} card`} onClick={handleLogOut}>
                        <span className={styles['user-name']}>{userName}</span>
                        <Icon name='exit' />
                    </div> : null}
                </div>
            }
            {showUserList ?
                <Modal title="Clients" onClose={() => setShowUserList(false)}>
                    {users && users.length ?
                        <UserList users={users} onClose={() => { setShowUserList(false); setIsOpen(false); router.reload() }} />
                        : <div className={styles['empty-list']} />
                    }
                </Modal> : null
            }
        </div>
    );
};

export default ProfileDropdown;