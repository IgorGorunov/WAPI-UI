import React, { useState } from 'react';
import styles from './styles.module.scss';
import Icon, { IconType } from "@/components/Icon";
import Link from "next/link";
import useAuth from "@/context/authContext";

export type NavItemType = {
    title: string;
    name: string;
    link: string;
}

export type SubmenuBlockType = {
    submenuTitle: string;
    submenuName: string;
    submenuIcon: IconType;
    submenuLink?: string;
    navItems: NavItemType[];
    handleClose?: () => void;
}

const SubmenuBlock: React.FC<SubmenuBlockType> = ({ submenuTitle, submenuIcon, navItems, handleClose }) => {

    const { isNavItemAccessible } = useAuth();
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <div className={`${styles['submenu-container'] || 'submenu-container'} ${styles[submenuTitle.replaceAll(' ', '')] || submenuTitle.replaceAll(' ', '')} ${isSubmenuOpen ? styles['submenu-container-expanded'] || 'submenu-container-expanded' : ''}`}>
            <div className={styles['submenu-header'] || 'submenu-header'} onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}>
                <Icon name={submenuIcon} style={{ width: "30px", height: "30px" }} className={styles['nav-icon'] || 'nav-icon'} />
                <span className={styles['submenu-header__text'] || 'submenu-header__text'} style={{ marginLeft: "20px" }}>{submenuTitle}</span>
                {isSubmenuOpen ? (
                    <span className={styles['nav-arrow-icon'] || 'nav-arrow-icon'}><Icon name="keyboard-arrow-up" /></span>
                ) : (
                    <span className={styles['nav-arrow-icon'] || 'nav-arrow-icon'}><Icon name="keyboard-arrow-right" /></span>
                )}
            </div>
            <div className={`${styles['submenu-items'] || 'submenu-items'} ${isSubmenuOpen ? styles['submenu-items-open'] || 'submenu-items-open' : ''}`}>
                {navItems.map(navItem => (
                    isNavItemAccessible(navItem.name) ? <Link key={navItem.title} href={navItem.link} className={styles['submenu-item'] || 'submenu-item'} onClick={handleClose}>
                        {navItem.title}
                        <span className={styles['nav-arrow-icon'] || 'nav-arrow-icon'}><Icon name="keyboard-arrow-right" /></span>
                    </Link> : null
                ))}
            </div>

        </div>
    )
}

export default SubmenuBlock;


