import React, {useEffect, useRef, useState} from "react";
import { DateRange as DateRangeBase } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Button from "@/components/Button/Button";
import { DateRangeType} from "@/types/dashboard";
import "./styles.scss";
import Icon from "@/components/Icon";
import {areDatesEqual, formatDateToString, getEndMonth} from "@/utils/date";
import CalendarBase, { CalendarProps } from "react-calendar";
import "react-calendar/dist/Calendar.css";


type DatepickerPropsType = {
    initialRange: DateRangeType;
    onDateRangeSave: (dateRange: DateRangeType) => void;
    onClose: ()=>void;
};

const DateRange = DateRangeBase as unknown as React.FC<any>;
const Calendar = CalendarBase as unknown as React.FC<CalendarProps>;

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
    }, [dateRange]);

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e?.target.value;
        if (val) {
            setDateRange(prevState => ([{...prevState[0], startDate: new Date(val) || prevState[0].startDate}]))
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e?.target.value;
        if (val) {
            setDateRange(prevState => ([{...prevState[0], endDate: new Date(val) || prevState[0].endDate}]))
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        onDateRangeSave(
            {
                startDate: dateRange[0].startDate,
                endDate: dateRange[0].endDate,
            }
        );
    };

    const [showDays, setShowDays] = useState(false);

    const handleMonthClick = (date: Date) => {
        if (dateRange && dateRange.length) {
            const curDate = dateRange[0];

            if (curDate.startDate && curDate.endDate) {
                if (!areDatesEqual(getEndMonth(curDate.startDate),getEndMonth(curDate.endDate))) {
                    //set date as both start date and end date
                    setDateRange(prevState=> ([{...prevState[0], startDate: date, endDate: getEndMonth(date)}]));
                } else {
                    if (date>curDate.startDate) {
                        //set end date
                        setDateRange(prevState=> ([{...prevState[0], endDate: getEndMonth(date)}]));
                    } else {
                        //set start date
                        setDateRange(prevState=> ([{...prevState[0], startDate: date}]));
                    }
                }
            }
        }
    };

    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        const curRange = dateRange[0];
        if (view === "year" && curRange.startDate && curRange.endDate) {
            const start = curRange.startDate;
            const end = curRange.endDate;
            if (date >= start && date <= end) {
                let decor = '';
                const curMonth = date.getMonth();
                if (areDatesEqual(date, start) && areDatesEqual(getEndMonth(date), end)) {
                    decor = 'decor-all';
                } else if (areDatesEqual(date, start) || curMonth == 0 ||  curMonth == 3 || curMonth == 6 || curMonth == 9) {
                    decor = 'decor-start';
                } else if (areDatesEqual(getEndMonth(date), end) || curMonth == 2 ||  curMonth == 5 || curMonth == 8 || curMonth == 11) {
                    decor = 'decor-end';
                }
                return `selected ${decor}`;
            }
        }
        return null;
    };

    return (
        <div className="datepicker">
            <button className="datepicker__close" onClick={onClose}>
                <Icon name='close'/>
            </button>
            <button className="datepicker__switch-mode" onClick={() => setShowDays(prevState => !prevState)}>
                {showDays ? 'Switch to months' : 'Switch to detailed calendar'}
            </button>
            <div className="card date-range-container">
                <div className='range-preview'>
                    <div className='range-preview-date__wrapper'>
                        <input type='date' id='date-range-start'
                               onChange={handleStartDateChange} ref={refRangeStartPreview}/>
                    </div>
                    <div className='range-preview-date__wrapper'>
                        <input type='date' id='date-range-end'
                               onChange={handleEndDateChange} ref={refRangeEndPreview}/>
                    </div>
                </div>
                {showDays ?
                    <DateRange
                        ranges={dateRange}
                        onChange={handleSelect}
                        months={1}
                        direction="horizontal"
                        weekStartsOn={1}
                        showMonthAndYearPickers={false}
                        showPreview={false}
                        //rangeColors={["#5380F5", "#5380F5"]}
                    />
                    :
                    <Calendar
                        value={[dateRange[0].startDate, dateRange[0].endDate]}
                        // onActiveStartDateChange={({ activeStartDate }) => setActiveStartDate(activeStartDate!)}
                        onClickMonth={handleMonthClick}
                        tileClassName={tileClassName}
                        view="year"
                        maxDetail="year"
                        minDetail="year"
                    />
                }
            </div>
            <div className="button-container">
                <Button icon="search" isFullWidth iconOnTheRight onClick={handleSave}>Search</Button>
            </div>
        </div>
    );
};

export default Datepicker;
