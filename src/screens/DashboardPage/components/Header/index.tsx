import React from "react";
import { DashboardPeriodType, PeriodType } from "@/types/dashboard";
import PeriodFilter from "../PeriodFilter";
import styles from "./styles.module.scss";

type HeaderProps = {
  currentPeriod: DashboardPeriodType;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<DashboardPeriodType>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
  clickedPeriod: PeriodType;
  setClickedPeriod: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className={`card ${styles['dashboard-header__container'] || 'dashboard-header__container'} dashboard-header__container ${styles['mb-md'] || 'mb-md'} mb-md`}>
      <div className={`${styles['dashboard-header__menu'] || 'dashboard-header__menu'} dashboard-header__menu`}>
        <h2>Dashboard</h2>
      </div>
      <div className={`${styles['dashboard-header__filter'] || 'dashboard-header__filter'} dashboard-header__filter`}>
        <PeriodFilter {...props} />
      </div>
      {/*<Icon name={"notification"} />*/}
    </div>
  );
};

export default Header;
