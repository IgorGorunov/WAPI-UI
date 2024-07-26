import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
import {SubmenuBlockType} from "@/components/Navigation/SubmenuBlock";
import {MessageKeys, useTranslations} from "next-intl";


const SubmenuSingleItem: React.FC<SubmenuBlockType> = ({submenuName, submenuTitle, submenuIcon, submenuLink, unreadAmount}) => {
    const t = useTranslations('Navigation');
    return (
        <div className={`submenu-single-item ${submenuTitle.replaceAll(' ','')}`}>
            <Link href={submenuLink} className="submenu-header" >
                <Icon name={submenuIcon} style={{width: "30px", height: "30px"}} />
                <span style={{marginLeft: "20px"}}>{t(submenuName as MessageKeys<any, any>, {unreadAmount: unreadAmount})}</span>
                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
            </Link>
        </div>
    )
}

export default SubmenuSingleItem;


