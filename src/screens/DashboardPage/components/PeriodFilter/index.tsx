import React, { useState } from "react";
import {
  DashboardPeriodType,
  PeriodType,
  PeriodTypes,
} from "@/types/dashboard";
import Datepicker from "./Datepicker";
import classes from "./PeriodFilter.module.scss";

export type PeriodFilterProps = {
  currentPeriod: DashboardPeriodType;
  setCurrentPeriod: React.Dispatch<React.SetStateAction<DashboardPeriodType>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  currentPeriod,
  setCurrentPeriod,
  setDiagramType,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const curPeriodType = currentPeriod.periodType;

  const handleDay = () => {
    setShowCustom(false);
    if (curPeriodType !== "DAY") {
      const startDate = new Date();
      const endDate = new Date();
      setCurrentPeriod({ periodType: "DAY", startDate, endDate });
      setDiagramType("DAY");
    }
  };

  // const getMonday = (d: Date) => {
  //   d = new Date(d);
  //   var day = d.getDay(),
  //     diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  //   return new Date(d.setDate(diff));
  // };

  // const getSunday = (d: Date) => {
  //   const lastDay = new Date(d);
  //   lastDay.setDate(lastDay.getDate() + 6);
  //   return lastDay;
  // };

  const getStartDate = (daysAmount: number) => {
    return new Date(new Date().setDate(new Date().getDate() - daysAmount + 1));
  };

  const handleWeek = () => {
    setShowCustom(false);
    if (curPeriodType !== "WEEK") {
      // const startDate = getMonday(new Date());
      // const endDate = getSunday(startDate);
      const startDate = getStartDate(7);
      const endDate = new Date();
      setCurrentPeriod({
        periodType: "WEEK",
        startDate,
        endDate,
      });

      setDiagramType("DAY");
    }
  };

  const handleMonth = () => {
    setShowCustom(false);
    if (curPeriodType !== "MONTH") {
      // const curDate = new Date();
      // const startDate = new Date(curDate.getFullYear(), curDate.getMonth(), 1);
      // const endDate = new Date(
      //   curDate.getFullYear(),
      //   curDate.getMonth() + 1,
      //   0
      // );
      const startDate = getStartDate(30);
      const endDate = new Date();
      setCurrentPeriod({
        periodType: "MONTH",
        startDate,
        endDate,
      });
      setDiagramType("DAY");
    }
  };

  const handleQuarter = () => {
    setShowCustom(false);
    if (curPeriodType !== "QUARTER") {
      // const curDay = new Date();
      // const currentQuarter = Math.floor(curDay.getMonth() / 3);
      // const year = curDay.getFullYear();

      // const startDate = new Date(year, currentQuarter * 3, 1);
      // const endDate = new Date(year, (currentQuarter + 1) * 3, 0);
      const startDate = getStartDate(90);
      const endDate = new Date();

      setCurrentPeriod({
        periodType: "QUARTER",
        startDate,
        endDate,
      });
      setDiagramType("WEEK");
    }
  };

  const handleYear = () => {
    setShowCustom(false);
    if (curPeriodType !== "YEAR") {
      // const curDay = new Date();
      // const year = curDay.getFullYear();

      // const startDate = new Date(year, 0, 1);
      // const endDate = new Date(year, 11, 31);
      const startDate = getStartDate(365);
      const endDate = new Date();

      setCurrentPeriod({
        periodType: "YEAR",
        startDate,
        endDate,
      });
      setDiagramType("MONTH");
    }
  };

  const handleCustom = () => {
    setShowCustom((prevState) => !prevState);
  };

  return (
    <div className={classes.container}>
      <ul className={classes.list}>
        <li
          key={PeriodTypes.DAY}
          className={`${classes.item} ${
            curPeriodType === "DAY" ? classes.active : ""
          }`}
          onClick={handleDay}
        >
          Day
        </li>
        <li
          key={PeriodTypes.WEEK}
          className={`${classes.item} ${
            curPeriodType === "WEEK" ? classes.active : ""
          }`}
          onClick={handleWeek}
        >
          Week
        </li>
        <li
          key={PeriodTypes.MONTH}
          className={`${classes.item} ${
            curPeriodType === "MONTH" ? classes.active : ""
          }`}
          onClick={handleMonth}
        >
          Month
        </li>
        <li
          key={PeriodTypes.QUARTER}
          className={`${classes.item} ${
            curPeriodType === "QUARTER" ? classes.active : ""
          }`}
          onClick={handleQuarter}
        >
          Quarter
        </li>
        <li
          key={PeriodTypes.YEAR}
          className={`${classes.item} ${
            curPeriodType === "YEAR" ? classes.active : ""
          }`}
          onClick={handleYear}
        >
          Year
        </li>
        <li
          key={PeriodTypes.CUSTOM}
          className={`${classes.item} ${
            curPeriodType === "CUSTOM" ? classes.active : ""
          }`}
          onClick={handleCustom}
        >
          Custom
        </li>
      </ul>
      <div className={classes.datepicker}>
        {showCustom && (
          <Datepicker
            currentPeriod={currentPeriod}
            setCurrentPeriod={setCurrentPeriod}
            setShowCustom={setShowCustom}
            setDiagramType={setDiagramType}
          />
        )}
      </div>
    </div>
  );
};

export default PeriodFilter;
