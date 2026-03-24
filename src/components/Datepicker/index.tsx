import React, { useEffect, useRef, useState } from "react";
import { DateRange } from "react-date-range";
import Button from "@/components/Button/Button";
import { DateRangeType } from "@/types/dashboard";
import Icon from "@/components/Icon";
import { formatDateToString } from "@/utils/date";
import Draggable from "react-draggable";
import styles from "./styles.module.scss";


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

    const refRangeStartPreview = useRef<HTMLInputElement>(null);
    const refRangeEndPreview = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (refRangeStartPreview?.current) {
            refRangeStartPreview.current.defaultValue = formatDateToString(dateRange[0].startDate)
        }
        if (refRangeEndPreview?.current) {
            refRangeEndPreview.current.defaultValue = formatDateToString(dateRange[0].endDate)
        }
    }, []);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e?.target.value;
        if (val) {
            setDateRange(prevState => ([{ ...prevState[0], startDate: new Date(val) || prevState[0].startDate }]))
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e?.target.value;
        if (val) {
            setDateRange(prevState => ([{ ...prevState[0], endDate: new Date(val) || prevState[0].endDate }]))
        }
    }

    const handleSelect = (ranges: any) => {
        setDateRange([ranges.selection]);

        if (refRangeStartPreview?.current) {
            refRangeStartPreview.current.defaultValue = formatDateToString(ranges.selection.startDate)
        }
        if (refRangeEndPreview?.current) {
            refRangeEndPreview.current.defaultValue = formatDateToString(ranges.selection.endDate)
        }
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
                                <input type='date' id='date-range-start'
                                    onChange={handleStartDateChange} ref={refRangeStartPreview} />
                            </div>
                            <div className={styles['range-preview-date__wrapper']}>
                                <input type='date' id='date-range-end'
                                    onChange={handleEndDateChange}
                                    ref={refRangeEndPreview}
                                    onKeyDown={(e) => (e.key === 'Enter' ? handleSave() : null)}
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