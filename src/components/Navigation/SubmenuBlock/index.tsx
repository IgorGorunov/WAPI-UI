import React, {useState} from 'react';
import Icon, {IconType} from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
import useAuth from "@/context/authContext";
import {MessageKeys, useTranslations} from "next-intl";

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
    handleClose?: ()=>void;
    unreadAmount?: number;
}

const SubmenuBlock: React.FC<SubmenuBlockType> = ({submenuName, submenuTitle, submenuIcon, navItems, handleClose}) => {
    const t = useTranslations('Navigation');
    const {isNavItemAccessible} = useAuth();
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <div className={`submenu-container ${submenuTitle.replaceAll(' ','')} ${isSubmenuOpen ? 'submenu-container-expanded' : ''}`}>
            <div className="submenu-header" onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}>
                <Icon name={submenuIcon} style={{width: "30px", height: "30px"}} />
                <span style={{marginLeft: "20px"}}>{t(submenuName as MessageKeys<any, any>)}</span>
                {setIsSubmenuOpen ?
                    <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :
                    <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                }
            </div>
            <div className="submenu-items">
                {navItems.map(navItem => (
                    isNavItemAccessible(navItem.name) ? <Link key={navItem.title} href={navItem.link} className="submenu-item" onClick={handleClose}>
                        {t(navItem.name as MessageKeys<any, any>)}
                        <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                    </Link> : null
                )) }
            </div>

        </div>
    )
}

export default SubmenuBlock;


