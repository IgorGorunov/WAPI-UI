import React, { useState } from "react";
import "./styles.scss";
import Icon from "@/components/Icon";
import Link from "next/link";

const Header = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleClick = () => {
        setMenuOpen(!isMenuOpen);
    }

    return (
        <div className='main-header'>
            <div className='main-header__icon' onClick={handleClick}>
                <Icon name={"menu-icon"} />
            </div>

            <div className={`burger-menu ${isMenuOpen ? 'burger-menu-open' : ''}`}>
                <div className={`burger-menu-child }`}>
                    <Link href="/" className="button-link" passHref onClick={()=>{setMenuOpen(false)}}>
                        <Icon name="home" style={{width: "30px", height: "30px"}} />
                        <span style={{marginLeft: "20px"}}>Dashboard</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Header;
