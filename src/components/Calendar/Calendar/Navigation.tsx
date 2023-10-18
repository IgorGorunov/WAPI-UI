"use client";

import React from "react";
import { getUserLocale } from "get-user-locale";

import {
  getCenturyLabel,
  getDecadeLabel,
  getBeginNext,
  getBeginNext2,
  getBeginPrevious,
  getBeginPrevious2,
  getEndPrevious,
  getEndPrevious2,
} from "../shared/dates";
import {
  formatMonthYear as defaultFormatMonthYear,
  formatYear as defaultFormatYear,
} from "../shared/dateFormatter";

import type { Action, NavigationLabelFunc, RangeType } from "../shared/types";

const className = "react-calendar__navigation";

type NavigationProps = {
  activeStartDate: Date;
  drillUp: () => void;
  formatMonthYear?: typeof defaultFormatMonthYear;
  formatYear?: typeof defaultFormatYear;
  locale?: string;
  maxDate?: Date;
  minDate?: Date;
  navigationAriaLabel?: string;
  navigationAriaLive?: "off" | "polite" | "assertive";
  navigationLabel?: NavigationLabelFunc;
  next2AriaLabel?: string;
  next2Label?: React.ReactNode;
  nextAriaLabel?: string;
  nextLabel?: React.ReactNode;
  prev2AriaLabel?: string;
  prev2Label?: React.ReactNode;
  prevAriaLabel?: string;
  prevLabel?: React.ReactNode;
  setActiveStartDate: (nextActiveStartDate: Date, action: Action) => void;
  showDoubleView?: boolean;
  view: RangeType;
  views: string[];
};

export default function Navigation({
  activeStartDate,
  drillUp,
  formatMonthYear = defaultFormatMonthYear,
  formatYear = defaultFormatYear,
  locale,
  maxDate,
  minDate,
  navigationAriaLabel = "",
  navigationAriaLive,
  navigationLabel,
  next2AriaLabel = "",
  next2Label = "»",
  nextAriaLabel = "",
  nextLabel = "›",
  prev2AriaLabel = "",
  prev2Label = "«",
  prevAriaLabel = "",
  prevLabel = "‹",
  setActiveStartDate,
  showDoubleView,
  view,
  views,
}: NavigationProps) {
  const drillUpAvailable = views.indexOf(view) > 0;
  const shouldShowPrevNext2Buttons = view !== "century";

  const previousActiveStartDate = getBeginPrevious(view, activeStartDate);
  const previousActiveStartDate2 = shouldShowPrevNext2Buttons
    ? getBeginPrevious2(view, activeStartDate)
    : undefined;
  const nextActiveStartDate = getBeginNext(view, activeStartDate);
  const nextActiveStartDate2 = shouldShowPrevNext2Buttons
    ? getBeginNext2(view, activeStartDate)
    : undefined;

  const prevButtonDisabled = (() => {
    if (previousActiveStartDate.getFullYear() < 0) {
      return true;
    }
    const previousActiveEndDate = getEndPrevious(view, activeStartDate);
    return minDate && minDate >= previousActiveEndDate;
  })();

  const prev2ButtonDisabled =
    shouldShowPrevNext2Buttons &&
    (() => {
      if ((previousActiveStartDate2 as Date).getFullYear() < 0) {
        return true;
      }
      const previousActiveEndDate = getEndPrevious2(view, activeStartDate);
      return minDate && minDate >= previousActiveEndDate;
    })();

  const nextButtonDisabled = maxDate && maxDate < nextActiveStartDate;

  const next2ButtonDisabled =
    shouldShowPrevNext2Buttons &&
    maxDate &&
    maxDate < (nextActiveStartDate2 as Date);

  function onClickPrevious() {
    setActiveStartDate(previousActiveStartDate, "prev");
  }

  function onClickPrevious2() {
    setActiveStartDate(previousActiveStartDate2 as Date, "prev2");
  }

  function onClickNext() {
    setActiveStartDate(nextActiveStartDate, "next");
  }

  function onClickNext2() {
    setActiveStartDate(nextActiveStartDate2 as Date, "next2");
  }

  function renderLabel(date: Date) {
    const label = formatMonthYear(locale, date);

    return label;
  }

  function renderButton() {
    const labelClassName = `${className}__label`;
    return (
      <span
        aria-label={navigationAriaLabel}
        aria-live={navigationAriaLive}
        // className={labelClassName}
        // disabled={!drillUpAvailable}
        // onClick={drillUp}
        style={{ flexGrow: 1 }}
        //type="button"
      >
        <span
          className={`${labelClassName}__labelText ${labelClassName}__labelText--from`}
        >
          {renderLabel(activeStartDate)}
        </span>
        {/* {showDoubleView ? (
          <>
            <span className={`${labelClassName}__divider`}> – </span>
            <span
              className={`${labelClassName}__labelText ${labelClassName}__labelText--to`}
            >
              {renderLabel(nextActiveStartDate)}
            </span>
          </>
        ) : null} */}
      </span>
    );
  }

  return (
    <div className={className}>
      {prevLabel !== null && (
        <button
          aria-label={prevAriaLabel}
          className={`${className}__arrow ${className}__prev-button`}
          disabled={prevButtonDisabled}
          onClick={onClickPrevious}
          type="button"
        >
          {prevLabel}
        </button>
      )}
      {renderButton()}
      {nextLabel !== null && (
        <button
          aria-label={nextAriaLabel}
          className={`${className}__arrow ${className}__next-button`}
          disabled={nextButtonDisabled}
          onClick={onClickNext}
          type="button"
        >
          {nextLabel}
        </button>
      )}
    </div>
  );
}
