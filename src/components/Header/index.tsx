import React, {useEffect, useState} from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import {useRouter} from "next/router";
import useAuth from "@/context/authContext";
import {Routes} from "@/types/routes";
import Navigation from "@/components/Navigation";
import HeaderNotifications from "@/components/HeaderNotifications";
import useTourGuide from "@/context/tourGuideContext";
import ProfileDropdown from "@/components/ProfileDropdown";

type HeaderType = {
    pageTitle?: string;
    toRight?: boolean;
    needTutorialBtn?: boolean;
    children?: React.ReactNode;
    noMenu?: boolean;
    needNotifications?: boolean;
}
const Header: React.FC<HeaderType> = ({pageTitle, toRight = false, children, needTutorialBtn=false, noMenu=false, needNotifications=true}) => {
    const { getUserName, logout } = useAuth();
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
        logout();
        await Router.push(Routes.Login);
    }

    const {runTour, setRunTour} = useTourGuide();

    return (
        <div className={`main-header`}>
            <div className='main-header__wrapper card'>
                <div className='main-header__menu-block' onClick={handleClick}>
                    {!noMenu && <div className='main-header__icon'>
                        <Icon name={"burger"}/>
                    </div>}
                    <div className={`page-title ${noMenu ? 'no-margin' : ''}`}><h2>{pageTitle}</h2></div>
                </div>

                <div className={`main-header__components ${toRight ? "align-right" : ""}`}>
                    {children}
                </div>

                <div className='main-header__user-block'>
                    <div className='main-header__user card' onClick={handleLogOut}>
                        <span className='user-name'>{curUserName}</span>
                        <Icon name='exit'/>
                    </div>
                    {/*<ProfileDropdown />*/}
                    {needTutorialBtn ?
                        <button className={`tour-guide ${runTour ? 'is-active' : ''}`} onClick={()=>setRunTour(!runTour)}><Icon name='book' /></button>
                        : null}
                    {needNotifications ? <div className='main-header__notifications'>
                        <HeaderNotifications />
                    </div> : null}
                </div>
            </div>

            <Navigation isMenuOpen={isMenuOpen} handleClose={()=>setMenuOpen(false)}/>
        </div>
    );
};

export default Header;
