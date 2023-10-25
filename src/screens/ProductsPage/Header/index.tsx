import React from "react";
import Icon from "@/components/Icon";
import "./styles.scss";



const Header: React.FC = (props) => {
  return (
    <div className={`card dashboard-header__container mb-md`}>
      <div className="dashboard-header__menu">
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-header__filter">
        {/*<PeriodFilter {...props} />*/}
      </div>
      <Icon name={"notification"} />
    </div>
  );
};

export default Header;
