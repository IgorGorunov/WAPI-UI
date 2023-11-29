import { PeriodType } from "@/types/dashboard";
import React, { useState } from "react";
import {DateRange} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "@/components/Button/Button";
import "./styles.scss";
import Icon from "@/components/Icon";



type DatePickerPropsType =  {
  currentPeriod: {
    periodType: PeriodType;
    startDate: Date;
    endDate: Date;
  };
  setCurrentPeriod: (period: any) => void;
  setShowCustom: React.Dispatch<React.SetStateAction<boolean>>;
  setDiagramType: React.Dispatch<React.SetStateAction<PeriodType>>;
};

const Datepicker: React.FC<DatePickerPropsType> = ({
  currentPeriod,
  setCurrentPeriod,
  setShowCustom,
  setDiagramType,
}) => {

  const initialStartDate = currentPeriod.startDate;
  const initialEndDate = currentPeriod.endDate;

  const [dateRange, setDateRange] = useState([
    {
      startDate: initialStartDate,
      endDate: initialEndDate,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    setDateRange([ranges.selection]);
  };

  const handleSave = () => {
    setCurrentPeriod({
      periodType: "CUSTOM",
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    });
    setShowCustom(false);
    setDiagramType("DAY");
  };

  return (
      <div className="datepicker">
        <a className="datepicker__close" href="#" onClick={()=>setShowCustom(false)}>
          <Icon name='close' />
        </a>
        <div className="date-range-container">
          <DateRange
              ranges={dateRange}
              onChange={handleSelect}
              months={1}
              direction="horizontal"
              weekStartsOn={1}
              showMonthAndYearPickers={false}
              rangeColors={["#5380F5", "#5380F5"]}
          />
        </div>
        <div className="button-container">
            <Button icon="search" isFullWidth iconOnTheRight onClick={handleSave}>Search</Button>
        </div>
      </div>
  );
};

export default Datepicker;
