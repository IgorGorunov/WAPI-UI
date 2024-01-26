import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import SubmenuBlock from "@/components/Navigation/SubmenuBlock";
import {navBlocks} from "@/components/Navigation/navItems.constants";
import './styles.scss'

type NavigationType = {
    handleClose: ()=>void;
}
const Navigation: React.FC<NavigationType> = ({handleClose}) => {

    return (
        // <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>
            <div className={`burger-menu-child`}>
                <button className="close-button" onClick={handleClose}>
                    <Icon name="close" style={{width: "30px", height: "30px"}} />
                </button>
                <div className='dashboard-menu-link'>
                    <Link href="/" className="button-link" passHref onClick={handleClose}>
                        <Icon name="home" className="icon-home"/>
                        <span style={{marginLeft: "20px"}}>Dashboard</span>
                    </Link>
                </div>
                {navBlocks && navBlocks.length ? navBlocks.map((navBlock, index)=> (
                    <div key={`${navBlock.submenuTitle}-${index}`}>
                        <SubmenuBlock  submenuTitle={navBlock.submenuTitle} submenuIcon={navBlock.submenuIcon} navItems={navBlock.navItems} handleClose={handleClose} />
                    </div>
                ))  : null}
            </div>
        // </div>
    )
}

export default Navigation;