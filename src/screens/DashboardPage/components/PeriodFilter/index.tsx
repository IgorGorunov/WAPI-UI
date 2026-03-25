import React, { useState } from "react";
import {
  DashboardPeriodType, DateRangeType,
  PeriodType,
  PeriodTypes,
} from "@/types/dashboard";
//import Datepicker from "./Datepicker";
import DatepickerComponent from '@/components/Datepicker';
import Icon from "@/components/Icon";
import styles from "./styles.module.scss";

export type PeriodFilterProps = {
  currentPeriod: DashboardPeriodType;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<DashboardPeriodType>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
  clickedPeriod: PeriodType;
  setClickedPeriod: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  currentPeriod,
  setCurrentPeriod,
  setDiagramType,
  clickedPeriod,
  setClickedPeriod
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const curPeriodType = currentPeriod.periodType;

  //const {currentDate} = useAuth();
  const currentDate = new Date();

  const handleDay = () => {
    setShowCustom(false);
    setClickedPeriod("DAY");
    if (curPeriodType !== "DAY") {
      const startDate = currentDate;
      const endDate = currentDate;
      setCurrentPeriod({ periodType: "DAY", startDate, endDate });
      setDiagramType("DAY");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Day");
    }
  };

  const getStartDate = (daysAmount: number) => {
    return new Date(new Date().setDate(currentDate.getDate() - daysAmount + 1));
  };

  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedPeriodType, setSelectedPeriodType] = useState(currentPeriod.periodType.toString());

  const handleWeek = () => {
    setShowCustom(false);
    setClickedPeriod("WEEK");
    if (curPeriodType !== "WEEK") {
      const startDate = getStartDate(7);
      const endDate = currentDate;
      setCurrentPeriod({
        periodType: "WEEK",
        startDate,
        endDate,
      });

      setDiagramType("DAY");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Week");
    }
  };

  const handleMonth = () => {
    setShowCustom(false);
    setClickedPeriod("MONTH");
    if (curPeriodType !== "MONTH") {
      const startDate = getStartDate(30);
      const endDate = currentDate;
      setCurrentPeriod({
        periodType: "MONTH",
        startDate,
        endDate,
      });
      setDiagramType("DAY");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Month");
    }
  };

  const handleQuarter = () => {
    setShowCustom(false);
    setClickedPeriod("QUARTER");
    if (curPeriodType !== "QUARTER") {
      const startDate = getStartDate(90);
      const endDate = currentDate;

      setCurrentPeriod({
        periodType: "QUARTER",
        startDate,
        endDate,
      });
      setDiagramType("WEEK");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Quarter");
    }
  };

  const handleYear = () => {
    setShowCustom(false);
    setClickedPeriod("YEAR");
    if (curPeriodType !== "YEAR") {
      const startDate = getStartDate(365);
      const endDate = currentDate;

      setCurrentPeriod({
        periodType: "YEAR",
        startDate,
        endDate,
      });
      setDiagramType("MONTH");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Year");
    }
  };

  const handleCustom = () => {
    clickedPeriod === "CUSTOM" ? setClickedPeriod(curPeriodType) : setClickedPeriod("CUSTOM");
    setShowCustom((prevState) => !prevState);
    setIsPeriodDropdownOpen(false);
    setSelectedPeriodType("CUSTOM");
  };

  const onSaveCurrentPeriod = (periodRange: DateRangeType) => {
    setCurrentPeriod({
      periodType: "CUSTOM",
      startDate: periodRange.startDate,
      endDate: periodRange.endDate,
    });
    setShowCustom(false);
    setDiagramType("DAY");
  }

  const onCloseCustom = () => {
    setShowCustom(false);
  }

  return (
    <div className={`${styles['period-filter'] || 'period-filter'} period-filter ${styles['period-filter__container'] || 'period-filter__container'} period-filter__container`}>
      <div onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)} className={`${styles['period-filter__dropdown'] || 'period-filter__dropdown'} period-filter__dropdown`}>
        <span className={`${styles['nav-arrow-icon'] || 'nav-arrow-icon'} nav-arrow-icon`}>  {selectedPeriodType} <Icon name="expand" className={`${styles['icon-right'] || 'icon-right'} icon-right`} /> </span>
      </div>
      <ul className={`${styles['period-filter__list'] || 'period-filter__list'} period-filter__list ${isPeriodDropdownOpen ? `${styles['open'] || 'open'} open` : ""}`}>
        <li
          key={PeriodTypes.DAY}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "DAY" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleDay}
        >
          Day
        </li>
        <li
          key={PeriodTypes.WEEK}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "WEEK" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleWeek}
        >
          Week
        </li>
        <li
          key={PeriodTypes.MONTH}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "MONTH" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleMonth}
        >
          Month
        </li>
        <li
          key={PeriodTypes.QUARTER}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "QUARTER" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleQuarter}
        >
          Quarter
        </li>
        <li
          key={PeriodTypes.YEAR}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "YEAR" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleYear}
        >
          Year
        </li>
        <li
          key={PeriodTypes.CUSTOM}
          className={`${styles['period-filter__list-item'] || 'period-filter__list-item'} period-filter__list-item ${clickedPeriod === "CUSTOM" ? `${styles['active'] || 'active'} active` : ""
            }`}
          onClick={handleCustom}
        >
          Custom
        </li>
      </ul>
      <div className={`${styles['period-filter__datepicker'] || 'period-filter__datepicker'} period-filter__datepicker`}>
        {showCustom && (

          // <Datepicker
          //   currentPeriod={currentPeriod}
          //   setCurrentPeriod={setCurrentPeriod}
          //   setShowCustom={setShowCustom}
          //   setDiagramType={setDiagramType}
          // />
          <DatepickerComponent initialRange={currentPeriod} onDateRangeSave={onSaveCurrentPeriod} onClose={onCloseCustom} />
        )}
      </div>
    </div>
  );
};

export default PeriodFilter;
