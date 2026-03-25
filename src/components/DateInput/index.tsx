import React, {useEffect, useRef, useState} from "react";
import { Icon } from "../Icon";
import styles from "./styles.module.scss";
import {DateRangeType} from "@/types/dashboard";
import Datepicker from "@/components/Datepicker";
import {formatDateToDisplayString} from "@/utils/date";
import useOutsideClick from "@/hooks/useOutsideClick";


type DateInputType = {
    currentRange?: DateRangeType;
    handleRangeChange: (periodRange: DateRangeType) => void
}
const DateInput: React.FC<DateInputType> = ({currentRange, handleRangeChange}) => {
    const [curRange, setCurRange] = useState<DateRangeType>(currentRange ? currentRange : {startDate: new Date() , endDate: new Date()});
    const [showDateInput, setShowDateInput] = useState(false);
    const handleDateInputClick = () => {
        setShowDateInput(prevSate => !prevSate);
    }

    useEffect(() => {
        setCurRange(prevState => currentRange ? currentRange : prevState );
    }, [currentRange]);

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

    return <div className={`${styles['date-input-field']} date-input-field`} ref={datePickerRef}>
        <div className={`${styles['date-input-btn'] || 'date-input-btn'} card`} onClick={handleDateInputClick}>
            <span className={styles['date-input-btn__text'] || 'date-input-btn__text'}>{formatDateToDisplayString(curRange.startDate)} - {formatDateToDisplayString(curRange.endDate)}</span>
            <span className={styles["date-input-icon"] || "date-input-icon"}>
                <Icon name='calendar'/>
            </span>
        </div>
        {showDateInput && (
            <div className={styles["date-input__datepicker"] || "date-input__datepicker"}>
                <Datepicker initialRange={curRange} onDateRangeSave={handleDateState} onClose={handleCloseDatePicker}/>
            </div>
        )}
    </div>
}

export default DateInput;