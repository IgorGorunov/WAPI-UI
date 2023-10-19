import React from "react";
import { DashboardPeriodType, PeriodType } from "@/types/dashboard";
import Icon from "@/components/Icon";
import PeriodFilter from "../PeriodFilter";
import "./styles.scss";

type HeaderProps = {
  currentPeriod: DashboardPeriodType;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<DashboardPeriodType>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className={`card dashboard-header__container mb-md`}>
      <div className="dashboard-header__menu">
        <Icon name={"menu-icon"} />
        <h2>Dashboard</h2>
      </div>
      <div className="dashboard-header__filter">
        <PeriodFilter {...props} />
      </div>
      <Icon name={"notification"} />
    </div>
  );
};

export default Header;
