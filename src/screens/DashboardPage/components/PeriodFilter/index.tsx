import React, { useState } from "react";
import {
  DashboardPeriodType,
  PeriodType,
  PeriodTypes,
} from "@/types/dashboard";
import Datepicker from "./Datepicker";
import "./styles.scss";
import Icon from "@/components/Icon";

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

  const handleDay = () => {
    setShowCustom(false);
    setClickedPeriod("DAY");
    if (curPeriodType !== "DAY") {
      const startDate = new Date();
      const endDate = new Date();
      setCurrentPeriod({ periodType: "DAY", startDate, endDate });
      setDiagramType("DAY");
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Day");
    }
  };

  const getStartDate = (daysAmount: number) => {
    return new Date(new Date().setDate(new Date().getDate() - daysAmount + 1));
  };

  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [selectedPeriodType, setSelectedPeriodType] = useState("Period type");

  const handleWeek = () => {
    setShowCustom(false);
    setClickedPeriod("WEEK");
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
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Week");
    }
  };

  const handleMonth = () => {
    setShowCustom(false);
    setClickedPeriod("MONTH");
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
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Month");
    }
  };

  const handleQuarter = () => {
    setShowCustom(false);
    setClickedPeriod("QUARTER");
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
      setIsPeriodDropdownOpen(false);
      setSelectedPeriodType("Quarter");
    }
  };

  const handleYear = () => {
    setShowCustom(false);
    setClickedPeriod("YEAR");
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

  return (
    <div className="period-filter period-filter__container">
      <div onClick={() => setIsPeriodDropdownOpen(!isPeriodDropdownOpen)} className="period-filter__dropdown">
        {selectedPeriodType}
      </div>
      <ul className={`period-filter__list ${isPeriodDropdownOpen ? "open" : ""}`}>
        <li
          key={PeriodTypes.DAY}
          className={`period-filter__list-item ${
            clickedPeriod === "DAY" ? "active" : ""
          }`}
          onClick={handleDay}
        >
          Day
        </li>
        <li
          key={PeriodTypes.WEEK}
          className={`period-filter__list-item ${
            clickedPeriod === "WEEK" ? "active" : ""
          }`}
          onClick={handleWeek}
        >
          Week
        </li>
        <li
          key={PeriodTypes.MONTH}
          className={`period-filter__list-item ${
            clickedPeriod === "MONTH" ? "active" : ""
          }`}
          onClick={handleMonth}
        >
          Month
        </li>
        <li
          key={PeriodTypes.QUARTER}
          className={`period-filter__list-item ${
            clickedPeriod === "QUARTER" ? "active" : ""
          }`}
          onClick={handleQuarter}
        >
          Quarter
        </li>
        <li
          key={PeriodTypes.YEAR}
          className={`period-filter__list-item ${
            clickedPeriod === "YEAR" ? "active" : ""
          }`}
          onClick={handleYear}
        >
          Year
        </li>
        <li
          key={PeriodTypes.CUSTOM}
          className={`period-filter__list-item ${
            clickedPeriod === "CUSTOM" ? "active" : ""
          }`}
          onClick={handleCustom}
        >
          Custom
        </li>
      </ul>
      <div className="period-filter__datepicker">
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
