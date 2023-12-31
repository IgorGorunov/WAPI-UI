import React, {useEffect, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Link from "next/link";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";

type HeaderType = {
    pageTitle?: string;
    toRight?: boolean;
    children?: React.ReactNode;
}
const Header: React.FC<HeaderType> = ({pageTitle, toRight = false, children}) => {
    const { getUserName, setToken, setUserName } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isProductSubmenuOpen, setProductSubmenuOpen] = useState(false);
    const [isOrderSubmenuOpen, setOrderSubmenuOpen] = useState(false);
    const [isFinanceSubmenuOpen, setFinanceSubmenuOpen] = useState(false);
    const handleClick = () => {
        setMenuOpen(!isMenuOpen);
    }

    const Router = useRouter();
    const [curUserName, setCurUserName] = useState<string|null|undefined>("");

    useEffect(() => {
        setCurUserName(getUserName());
    }, []);

    const handleLogOut = async() => {
        setToken("");
        setUserName("");
        await Router.push(Routes.Login);
    }

    return (
        <div className={`main-header`}>
            <div className = 'main-header__wrapper card'>
                <div className='main-header__menu-block' onClick={handleClick}>
                    <div className='main-header__icon'>
                        <Icon name={"menu-icon"} />
                    </div>
                    <div className="page-title"><h2>{pageTitle}</h2></div>
                </div>

                <div className={`main-header__components ${toRight ? "align-right" : ""}`}>
                    {children}
                </div>

                <div className='main-header__user card' onClick={handleLogOut}>
                    <span className='user-name'>{curUserName}</span>
                    <Icon name='exit' />
                </div>
            </div>
            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>
                <div className={`burger-menu-child`}>
                    <button className="close-button" onClick={handleClick}>
                        <Icon name="close" style={{width: "30px", height: "30px"}} />
                    </button>
                    <div className='dashboard-menu-link'>
                        <Link href="/" className="button-link" passHref onClick={()=>{setMenuOpen(false)}}>
                            <Icon name="home" className="icon-home"/>
                            <span style={{marginLeft: "20px"}}>Dashboard</span>
                        </Link>
                    </div>
                    <div className={`submenu-container${isProductSubmenuOpen ? '-expanded' : ''}`}>
                        <div className="submenu-header" onClick={() => setProductSubmenuOpen(!isProductSubmenuOpen)}>
                            <Icon name="products" style={{width: "30px", height: "30px"}} />
                            <span style={{marginLeft: "20px"}}>Products</span>
                            {isProductSubmenuOpen ?
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            }
                        </div>
                        <div className="submenu-items">
                            <Link href="/products" className="submenu-item">
                                Products list
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </Link>
                            <Link href="/productsStock" className="submenu-item">
                                Products stock
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </Link>
                        </div>

                    </div>
                    <div className={`submenu-container${isOrderSubmenuOpen ? '-expanded' : ''}`}>
                        <div className="submenu-header" onClick={() => setOrderSubmenuOpen(!isOrderSubmenuOpen)}>
                            <Icon name="orders" style={{width: "30px", height: "30px"}} />
                            <span style={{marginLeft: "20px"}}>Orders</span>
                            {isOrderSubmenuOpen ?
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            }
                        </div>
                        <div className="submenu-items">
                            <Link href="/orders" className="submenu-item">
                                Fulfillment
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </Link>
                            <Link href="/amazonPrep" className="submenu-item">
                                Amazon Prep
                                <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>
                            </Link>
                        </div>
                    </div>
                    {/*<div className={`submenu-container${isFinanceSubmenuOpen ? '-expanded' : ''}`}>*/}
                    {/*    <div className="submenu-header" onClick={() => setFinanceSubmenuOpen(!isFinanceSubmenuOpen)}>*/}
                    {/*        <Icon name="finances" style={{width: "30px", height: "30px"}} />*/}
                    {/*        <span style={{marginLeft: "20px"}}>Finances</span>*/}
                    {/*        {isFinanceSubmenuOpen ?*/}
                    {/*            <span className="nav-arrow-icon"><Icon name="keyboard-arrow-up"/></span> :*/}
                    {/*            <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>*/}
                    {/*        }*/}
                    {/*    </div>*/}
                    {/*    <div className="submenu-items">*/}
                    {/*        <Link href="/invoices" className="submenu-item">*/}
                    {/*            Invoices*/}
                    {/*            <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>*/}
                    {/*        </Link>*/}
                    {/*        <Link href="/codReports" className="submenu-item">*/}
                    {/*            COD reports*/}
                    {/*            <span className="nav-arrow-icon"><Icon name="keyboard-arrow-right"/></span>*/}
                    {/*        </Link>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                </div>
            </div>
        </div>
    );
};

export default Header;
