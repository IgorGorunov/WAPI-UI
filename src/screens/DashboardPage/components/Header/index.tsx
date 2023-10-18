import React from "react";
import { DashboardPeriodType, PeriodType } from "@/types/dashboard";
import Icon from "@/components/Icon";
import PeriodFilter from "../PeriodFilter";
import classes from "./Header.module.scss";

type HeaderProps = {
  currentPeriod: DashboardPeriodType;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<DashboardPeriodType>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className={`card ${classes.container} mb-md`}>
      <div className={classes.menu}>
        <Icon name={"menu-icon"} />
        <h2>Dashboard</h2>
      </div>
      <div className={classes.filter}>
        <PeriodFilter {...props} />
      </div>
      <Icon name={"notification"} />
    </div>
  );
};

export default Header;
