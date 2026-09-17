import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import './styles.module.scss'
// Note: due to the number of classes we will just let it be global for now if it's too complex, wait, actually I must import it as styles and use it.
import styles from './styles.module.scss';
import Icon, { IconType } from "@/components/Icon";
import useAuth from "@/context/authContext";
import { Routes } from "@/types/routes";
import Router, { useRouter } from "next/router";
import useOutsideClick from "@/hooks/useOutsideClick";
import Modal from "@/components/Modal";
import UserList, { UserType } from "@/components/ProfileDropdown/UserList";
import { getUserList } from "@/services/auth";
import Loader from "@/components/Loader";
import useTenant from "@/context/tenantContext";
import useBonusProgram from "@/context/bonusProgramContext";
import { BONUS_TIER_TYPE } from "@/types/bonusProgram";

const TIER_ICONS: Record<string, IconType> = {
    [BONUS_TIER_TYPE.Base]: 'shield',
    [BONUS_TIER_TYPE.Silver]: 'star',
    [BONUS_TIER_TYPE.Gold]: 'medal',
    [BONUS_TIER_TYPE.Platinum]: 'diamond',
    [BONUS_TIER_TYPE.VIP]: 'crown',
};

const ProfileDropdown = () => {
    const { token, userName, logout, userStatus, superUser } = useAuth();
    const { currentTier } = useBonusProgram();
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
        setIsOpen(false);
        await Router.push(Routes.Profile);
    }

    const handleOpenBonusProgram = async () => {
        setIsOpen(false);
        await Router.push(Routes.BonusProgram);
    }

    const handleLogOut = async () => {
        logout();
        await Router.push(Routes.Login);
    }

    const handleUserList = () => {
        fetchUsers();
        setShowUserList(true);
    }

    const currentTierIconName: IconType = useMemo(() => {
        return (currentTier && TIER_ICONS[currentTier]) ? TIER_ICONS[currentTier] : 'shield';
    }, [currentTier]);

    return (
        <div className={styles["profile-dropdown"]} ref={dropdownRef}>
            {isLoading && <Loader />}
            {userStatus == 'user' ?
                <div>
                    <button className={`${styles['profile-dropdown__user']} card ${currentTier ? styles['has-tier'] : ''}`} onClick={() => setIsOpen(!isOpen)}>
                        {superUser ? <Icon name='admin' /> : <Icon name='user' />}
                        <span className={styles['user-name']}>{displayedName}</span>
                        {currentTier ? (
                            <span className={`${styles['header-tier-badge']}`} title={`${currentTier} Tier`}>
                                <Icon name={currentTierIconName} className={`${styles['badge-icon']} ${styles['icon-'+currentTier.toLowerCase()]}`} />
                            </span>
                        ) : null}
                    </button>
                    {isOpen ? (
                        <ul className={`${styles["profile-dropdown__menu"]} card`}>
                            <li key='bonus-program' className={`${styles["profile-dropdown__menu-item"]} ${styles["bonus-program-item"]}`}>
                                <button className={styles["profile-dropdown__menu-item-btn"]} onClick={handleOpenBonusProgram}>
                                    <div className={styles["bonus-menu-row"]}>
                                        <div className={styles["bonus-menu-left"]}>
                                            <Icon name='gift-box' className={styles["bonus-menu-icon"]} />
                                            <span>Bonus Program</span>
                                        </div>
                                        {currentTier ? (
                                            <span className={`${styles['menu-tier-pill']} ${styles[`tier-${currentTier.toLowerCase()}`]}`} title={`${currentTier} Tier`}>
                                                <Icon name={currentTierIconName} className={styles['menu-tier-icon']} />
                                            </span>
                                        ) : null}
                                    </div>
                                </button>
                            </li>
                            <div className={styles['dropdown-divider']} />
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