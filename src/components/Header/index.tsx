import React, {useEffect, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import Navigation from "@/components/Navigation";

type HeaderType = {
    pageTitle?: string;
    toRight?: boolean;
    children?: React.ReactNode;
}
const Header: React.FC<HeaderType> = ({pageTitle, toRight = false, children}) => {
    const { getUserName, setToken, setUserName } = useAuth();
    const [isMenuOpen, setMenuOpen] = useState(false);

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
                        <Icon name={"burger"} />
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

            {/*<div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>*/}
                <Navigation isMenuOpen={isMenuOpen} handleClose={()=>setMenuOpen(false)}/>
            {/*</div>*/}
        </div>
    );
};

export default Header;
