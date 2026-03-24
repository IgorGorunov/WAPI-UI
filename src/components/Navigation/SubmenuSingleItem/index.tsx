import React from 'react';
import styles from './styles.module.scss';
import Icon from "@/components/Icon";
import Link from "next/link";
import { SubmenuBlockType } from "@/components/Navigation/SubmenuBlock";


const SubmenuSingleItem: React.FC<SubmenuBlockType> = ({ submenuTitle, submenuIcon, submenuLink }) => {

    return (
        <div className={`${styles['submenu-single-item'] || 'submenu-single-item'} ${styles[submenuTitle.replaceAll(' ', '')] || submenuTitle.replaceAll(' ', '')}`}>
            <Link href={submenuLink} className={styles['submenu-header'] || 'submenu-header'} >
                <Icon name={submenuIcon} style={{ width: "30px", height: "30px" }} className={styles['nav-icon'] || 'nav-icon'} />
                <span className={styles['submenu-header__text'] || 'submenu-header__text'} style={{ marginLeft: "20px" }}>{submenuTitle}</span>
                <span className={styles['nav-arrow-icon'] || 'nav-arrow-icon'}><Icon name="keyboard-arrow-right" /></span>
            </Link>
        </div>
    )
}

export default SubmenuSingleItem;


