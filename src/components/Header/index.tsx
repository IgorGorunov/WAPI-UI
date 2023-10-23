import React from "react";
import "./styles.scss";
import Icon from "@/components/Icon";


const Header = () => {

  const handleClick = () => {
    //
  }


  return <div className='main-header'>
    <div className='main-header__icon' onClick={handleClick}>
      <Icon name={"menu-icon"} />
    </div>
  </div>;
};

export default Header;
