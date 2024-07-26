import React, {useEffect, useRef, useState} from "react";
import {DateRange} from "@umakantp/react-date-range";
import '@umakantp/react-date-range/dist/styles.css';
import '@umakantp/react-date-range/dist/theme/default.css';
import Button from "@/components/Button/Button";
import { DateRangeType} from "@/types/dashboard";
import "./styles.scss";
import Icon from "@/components/Icon";
import {formatDateToString} from "@/utils/date";
import { es, enGB } from 'date-fns/locale';
import {useTranslations} from "next-intl";
import {useRouter} from "next/router";
import {LocalesAndLanguages} from "@/constants/translations";


type DatepickerPropsType = {
  initialRange: DateRangeType;
  onDateRangeSave: (dateRange: DateRangeType) => void;
  onClose: ()=>void;
};

const Datepicker: React.FC<DatepickerPropsType> = ({ initialRange, onDateRangeSave, onClose }) => {
  const t = useTranslations('common');
  const {locale} = useRouter();
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
          setDateRange(prevState => ([{...prevState[0], startDate: new Date(val) || prevState[0].startDate}]))
      }
  }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e?.target.value;
        if (val) {
            setDateRange(prevState => ([{...prevState[0], endDate: new Date(val) || prevState[0].endDate}]))
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



  return (
      <div className="datepicker">
        <a className="datepicker__close" href="#" onClick={onClose}>
          <Icon name='close' />
        </a>

          <div className="date-range-container">
              <div className='range-preview'>
                  <div className='range-preview-date__wrapper'>
                      <input type='date' id='date-range-start'
                             onChange={handleStartDateChange} ref={refRangeStartPreview}/>
                  </div>
                  <div className='range-preview-date__wrapper'>
                      <input type='date' id='date-range-end'
                             onChange={handleEndDateChange} ref={refRangeEndPreview} />
                  </div>
              </div>
              <DateRange
                  locale={LocalesAndLanguages[locale] || enGB}
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
          <div className="button-container">
              <Button icon="search" isFullWidth iconOnTheRight onClick={handleSave}>{t('search')}</Button>
          </div>
      </div>
  );
};

export default Datepicker;
