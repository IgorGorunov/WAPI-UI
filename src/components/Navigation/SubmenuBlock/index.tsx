import React, {useState} from 'react';
import Icon, {IconType} from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
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
    handleClose?: ()=>void;
}

const SubmenuBlock: React.FC<SubmenuBlockType> = ({submenuTitle, submenuIcon, navItems, handleClose}) => {

    const {isNavItemAccessible} = useAuth()
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <div className={`submenu-container ${submenuTitle.replaceAll(' ','')} ${isSubmenuOpen ? 'submenu-container-expanded' : ''}`}>
            <div className="submenu-header" onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}>
                <Icon name={submenuIcon} style={{width: "30px", height: "30px"}} />
                <span style={{marginLeft: "20px"}}>{submenuTitle}</span>
                {setIsSubmenuOpen ?
                    <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :
                    <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                }
            </div>
            <div className="submenu-items">
                {navItems.map(navItem => (
                    isNavItemAccessible(navItem.name) ? <Link key={navItem.title} href={navItem.link} className="submenu-item" onClick={handleClose}>
                        {navItem.title}
                        <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                    </Link> : null
                )) }
            </div>

        </div>
    )
}

export default SubmenuBlock;


