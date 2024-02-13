import React from 'react';
import Icon from "@/components/Icon";
import Link from "next/link";
import SubmenuBlock from "@/components/Navigation/SubmenuBlock";
import {navBlocks} from "@/components/Navigation/navItems.constants";
import './styles.scss'
import SubmenuSingleItem from "@/components/Navigation/SubmenuSingleItem";

type NavigationType = {
    isMenuOpen: boolean;
    handleClose: ()=>void;
}
const Navigation: React.FC<NavigationType> = ({isMenuOpen, handleClose}) => {

    return (
        <div className={`burger-menu__overlay ${isMenuOpen ? 'burger-menu__overlay-open' : ''}`} onClick={handleClose}>
            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`} onClick={(e)=>e.stopPropagation()}>
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
                            {navBlock.submenuLink && !navBlock.navItems.length ?
                                <SubmenuSingleItem {...navBlock}/>
                                :
                                <SubmenuBlock  submenuTitle={navBlock.submenuTitle} submenuIcon={navBlock.submenuIcon} navItems={navBlock.navItems} handleClose={handleClose} />
                            }
                        </div>
                    ))  : null}
                </div>
            </div>
        </div>
    )
}

export default Navigation;