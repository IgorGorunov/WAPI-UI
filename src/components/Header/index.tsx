import React, { useState } from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Link from "next/link";

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isProductSubmenuOpen, setProductSubmenuOpen] = useState(false);
    const handleClick = () => {
        setMenuOpen(!isMenuOpen);
    }

    return (
        <div className='main-header'>
            <div className='main-header__icon' onClick={handleClick}>
                <Icon name={"menu-icon"} />
            </div>
            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>
                <div className={`burger-menu-child`}>
                    <button className="close-button" onClick={handleClick}>
                        <Icon name="close" style={{width: "30px", height: "30px"}} />
                    </button>
                    <Link href="/" className="button-link" passHref onClick={()=>{setMenuOpen(false)}}>
                        <Icon name="home" style={{width: "30px", height: "30px"}} />
                        <span style={{marginLeft: "20px"}}>Dashboard</span>
                    </Link>

                    <div className={`submenu-container-${isProductSubmenuOpen ? 'expanded' : ''}`}>
                        <div className="submenu-header" onClick={() => setProductSubmenuOpen(!isProductSubmenuOpen)}>
                            <Icon name="products" style={{width: "30px", height: "30px"}} />
                            <span style={{marginLeft: "20px"}}>Products</span>
                            {isProductSubmenuOpen ?
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            }
                        </div>
                        <div className="submenu-items">
                            <div>Product list</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Header;
