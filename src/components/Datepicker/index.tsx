import React, { useRef, useState } from "react";
import { DateRange } from "react-date-range";
import Button from "@/components/Button/Button";
import { DateRangeType } from "@/types/dashboard";
import Icon from "@/components/Icon";
import { formatDateToDisplayString } from "@/utils/date";
import Draggable from "react-draggable";
import styles from "./styles.module.scss";
import DateInputSegmented from "@/components/DateInputSegmented";

type DatepickerPropsType = {
    initialRange: DateRangeType;
    onDateRangeSave: (dateRange: DateRangeType) => void;
    onClose: () => void;
};

const Datepicker: React.FC<DatepickerPropsType> = ({ initialRange, onDateRangeSave, onClose }) => {

    const [dateRange, setDateRange] = useState([
        {
            startDate: initialRange.startDate,
            endDate: initialRange.endDate,
            key: "selection",
        },
    ]);

    // const refRangeStartPreview = useRef<HTMLInputElement>(null);
    // const refRangeEndPreview = useRef<HTMLInputElement>(null);
    //
    // useEffect(() => {
    //     if (refRangeStartPreview?.current) {
    //         refRangeStartPreview.current.defaultValue = formatDateToString(dateRange[0].startDate)
    //     }
    //     if (refRangeEndPreview?.current) {
    //         refRangeEndPreview.current.defaultValue = formatDateToString(dateRange[0].endDate)
    //     }
    // }, []);

    const parseAndSetDate = (val: string, isStart: boolean) => {
        const parts = val.split('.');
        if (parts.length === 3 && parts[2].length === 4) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const year = parseInt(parts[2], 10);
            const newDate = new Date(year, month, day);
            if (!isNaN(newDate.getTime())) {
                setDateRange(prevState => {
                    const newState = { ...prevState[0] };
                    if (isStart) newState.startDate = newDate;
                    else newState.endDate = newDate;
                    return [newState];
                });
            }
        }
    }

    const handleStartDateChange = (val: string) => {
        parseAndSetDate(val, true);
    }

    const handleEndDateChange = (val: string) => {
        parseAndSetDate(val, false);
    }

    const handleSelect = (ranges: any) => {
        setDateRange([ranges.selection]);

        // if (refRangeStartPreview?.current) {
        //     refRangeStartPreview.current.defaultValue = formatDateToString(ranges.selection.startDate)
        // }
        // if (refRangeEndPreview?.current) {
        //     refRangeEndPreview.current.defaultValue = formatDateToString(ranges.selection.endDate)
        // }
    };

    const handleSave = () => {
        onDateRangeSave({
            startDate: dateRange[0].startDate,
            endDate: dateRange[0].endDate,
        });
    };

    const nodeRef = useRef(null);

    return (
        <div>
            <Draggable
                // handle=".date-range-container"
                cancel="input, textarea, select, option, button, a, .rdrCalendarWrapper, .rdrDay, .rdrMonth, .rdrMonths"
                nodeRef={nodeRef}
            >
                <div className={styles.datepicker} ref={nodeRef}>
                    <a className={styles.datepicker__close} href="#" onClick={onClose}>
                        <Icon name='close' />
                    </a>

                    <div className={styles['date-range-container']}>
                        <div className={styles['range-preview']}>
                            <div className={styles['range-preview-date__wrapper']}>
                                {/*<input type='date' id='date-range-start'*/}
                                {/*       onChange={handleStartDateChange} ref={refRangeStartPreview} />*/}
                                <DateInputSegmented 
                                    id='date-range-start'
                                    dateStr={formatDateToDisplayString(dateRange[0].startDate)} 
                                    onChange={handleStartDateChange} 
                                />
                            </div>
                            <div className={styles['range-preview-date__wrapper']}>
                                <DateInputSegmented 
                                    id='date-range-end'
                                    dateStr={formatDateToDisplayString(dateRange[0].endDate)} 
                                    onChange={handleEndDateChange} 
                                    onEnter={handleSave}
                                />
                            </div>
                        </div>
                        <DateRange
                            ranges={dateRange}
                            onChange={handleSelect}
                            months={1}
                            direction="horizontal"
                            weekStartsOn={1}
                            showMonthAndYearPickers={false}
                            showPreview={false}
                            rangeColors={["#5380F5", "#5380F5"]}
                        />
                    </div>
                    <div className={`${styles['button-container']} 'button-container'`}>
                        <Button icon="search" isFullWidth iconOnTheRight onClick={handleSave}>Search</Button>
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

export default Datepicker;