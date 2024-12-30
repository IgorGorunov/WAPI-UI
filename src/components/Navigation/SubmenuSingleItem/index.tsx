import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import './styles.scss'
import {SubmenuBlockType} from "@/components/Navigation/SubmenuBlock";


const SubmenuSingleItem: React.FC<SubmenuBlockType> = ({submenuTitle, submenuIcon, submenuLink}) => {

    return (
        <div className={`submenu-single-item ${submenuTitle.replaceAll(' ','')}`}>
            <Link href={submenuLink} className="submenu-header" >
                <Icon name={submenuIcon} style={{width: "30px", height: "30px"}} className="nav-icon"/>
                <span style={{marginLeft: "20px"}}>{submenuTitle}</span>
                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
            </Link>
        </div>
    )
}

export default SubmenuSingleItem;


