import React, {useState} from "react";
import { Icon } from "../Icon";
import "./styles.scss";
import {DateRangeType} from "@/types/dashboard";
import Datepicker from "@/components/Datepicker"


type DateInputType = {
    currentRange?: DateRangeType;
    handleRangeChange: (periodRange: DateRangeType) => void
}
const DateInput: React.FC<DateInputType> = ({currentRange = {startDate: new Date(), endDate: new Date() }, handleRangeChange}) => {
    const [curRange, setCurRange] = useState<DateRangeType>(currentRange);
    const [showDateInput, setShowDateInput] = useState(false);
    const handleDateInputClick = () => {
        setShowDateInput(prevSate => !prevSate);
    }

    const handleDateState = (periodRange: DateRangeType) => {
        setCurRange(periodRange);
        handleRangeChange(periodRange);
        setShowDateInput(false);
    }

    return <div className='date-input-field'>
        <div className='date-input-btn card' onClick={handleDateInputClick}>
            <span className='date-input-btn__text'>{curRange.startDate.toLocaleDateString()} - {curRange.endDate.toLocaleDateString()}</span>
            <span className="date-input-icon">
                <Icon name='calendar'/>
            </span>
        </div>
        {showDateInput && (<div className="date-input__datepicker"><Datepicker initialRange={curRange} onDateRangeSave={handleDateState} onClose={()=>setShowDateInput(false)}/></div>)}
    </div>
}

export default DateInput;