import React, {useRef, useState} from "react";
import { Icon } from "../Icon";
import "./styles.scss";
import {DateRangeType} from "@/types/dashboard";
import Datepicker from "@/components/Datepicker"
import useAuth from "@/context/authContext";
import {formatDateToDisplayString} from "@/utils/date";
import useOutsideClick from "@/hooks/useOutsideClick";


type DateInputType = {
    currentRange?: DateRangeType;
    handleRangeChange: (periodRange: DateRangeType) => void
}
const DateInput: React.FC<DateInputType> = ({currentRange, handleRangeChange}) => {
    const {currentDate} = useAuth();
    const [curRange, setCurRange] = useState<DateRangeType>(currentRange ? currentRange : {startDate: currentDate, endDate: currentDate});
    const [showDateInput, setShowDateInput] = useState(false);
    const handleDateInputClick = () => {
        setShowDateInput(prevSate => !prevSate);
    }

    const handleDateState = (periodRange: DateRangeType) => {
        setCurRange(periodRange);
        handleRangeChange(periodRange);
        setShowDateInput(false);
    }

    const handleCloseDatePicker = () => {
        setShowDateInput(false);
    }

    const datePickerRef = useRef<HTMLDivElement>(null);

    useOutsideClick(datePickerRef, handleCloseDatePicker);

    return <div className='date-input-field' ref={datePickerRef}>
        <div className='date-input-btn card' onClick={handleDateInputClick}>
            <span className='date-input-btn__text'>{formatDateToDisplayString(curRange.startDate)} - {formatDateToDisplayString(curRange.endDate)}</span>
            <span className="date-input-icon">
                <Icon name='calendar'/>
            </span>
        </div>
        {showDateInput && (<div className="date-input__datepicker"><Datepicker initialRange={curRange} onDateRangeSave={handleDateState} onClose={handleCloseDatePicker}/></div>)}
    </div>
}

export default DateInput;