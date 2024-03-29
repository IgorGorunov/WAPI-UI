import React, {useState} from 'react';
import Icon, {IconType} from "@/components/Icon";
import Link from "next/link";
import './styles.scss'

export type NavItemType = {
    title: string;
    link: string;
}

export type SubmenuBlockType = {
    submenuTitle: string;
    submenuIcon: IconType;
    submenuLink?: string;
    navItems: NavItemType[];
    handleClose?: ()=>void;
}

const SubmenuBlock: React.FC<SubmenuBlockType> = ({submenuTitle, submenuIcon, navItems, handleClose}) => {

    const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);

    return (
        <div className={`submenu-container ${isSubmenuOpen ? 'submenu-container-expanded' : ''}`}>
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
                    <Link key={navItem.title} href={navItem.link} className="submenu-item" onClick={handleClose}>
                        {navItem.title}
                        <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                    </Link>
                )) }
            </div>

        </div>
    )
}

export default SubmenuBlock;


