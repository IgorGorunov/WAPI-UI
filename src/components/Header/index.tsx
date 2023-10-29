import React, { useState } from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Link from "next/link";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";

const Header = () => {
    const { userName, getUserName, setToken, setUserName } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isProductSubmenuOpen, setProductSubmenuOpen] = useState(false);

    const Router = useRouter();
    const handleClick = () => {
        setMenuOpen(!isMenuOpen);
    }

    console.log("userName: ", userName);
    const handleLogOut = async() => {
        setToken("");
        setUserName("");
        await Router.push(Routes.Login);
    }

    return (
        <div className='main-header'>
            <div className="main-header__wrapper">
                <div className='main-header__icon' onClick={handleClick}>
                    <Icon name={"menu-icon"} />
                </div>
                <div className='main-header__user card' onClick={handleLogOut}>
                    <Icon name={"user"} />
                    <span className='user-name'>{getUserName()}</span>
                </div>
            </div>
            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>
                <div className={`burger-menu-child`}>
                    <button className="close-button" onClick={handleClick}>
                        <Icon name="close" style={{width: "30px", height: "30px"}} />
                    </button>
                    <Link href="/" className="button-link" passHref onClick={()=>{setMenuOpen(false)}}>
                        <Icon name="home" className="icon-home"/>
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
                            <div className="submenu-item">
                                <Link href="/products" >Products list </Link>
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </div>
                            <div className="submenu-item">
                                <Link href="/productsStock" >Products stock</Link>
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Header;
