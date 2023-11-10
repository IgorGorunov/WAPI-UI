import React, { useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "@/components/Button/Button";
import { DateRangeType} from "@/types/dashboard";
import "./styles.scss";

// type DateRangeType = {
//   startDate: Date;
//   endDate: Date;
// };

type DatepickerPropsType = {
  initialRange: DateRangeType;
  onDateRangeSave: (dateRange: DateRangeType) => void;
};



const Datepicker: React.FC<DatepickerPropsType> = ({ initialRange, onDateRangeSave }) => {

  const [dateRange, setDateRange] = useState([
    {
      startDate: initialRange.startDate,
      endDate: initialRange.endDate,
      key: "selection",
    },
  ]);

  const handleSelect = (ranges: any) => {
    setDateRange([ranges.selection]);
  };

  const handleSave = () => {
    onDateRangeSave({
      startDate: dateRange[0].startDate,
      endDate: dateRange[0].endDate,
    });
  };

  return (
      <div className="datepicker">
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
