import React from "react";
// import Icon from "@/components/Icon";
import { ForecastType } from "@/types/dashboard";
// import Skeleton from "@/components/Skeleton/Skeleton";
import styles from "./styles.module.scss";

type ForecastPropsType = {
  type?: ForecastType;
  amountInPeriod: number;
  beginOfMonth: number;
  beginOfYear: number;
  forecastByMonth: number;
  forecastByYear: number;
  isError?: boolean;
  errorMessage?: string;
};

const Forecast: React.FC<ForecastPropsType> = (props) => {
  const {
    type = "GMV",
    amountInPeriod,
    beginOfMonth,
    beginOfYear,
    forecastByMonth,
    forecastByYear,
    isError = false,
    errorMessage = 'Something went wrong!',
  } = props;

  const isGMV = type === "GMV";
  const amountPrefix = isGMV ? "€" : "";

  const Formatter = Intl.NumberFormat('en-GB');

  const amounts = {
    beginOfMonth: Formatter.format(Math.floor(beginOfMonth)).replaceAll(
      ",",
      " "
    ),
    beginOfYear: Formatter.format(Math.floor(beginOfYear)).replaceAll(",", " "),
    forecastByMonth: Formatter.format(Math.floor(forecastByMonth)).replaceAll(
      ",",
      " "
    ),
    forecastByYear: Formatter.format(Math.floor(forecastByYear)).replaceAll(
      ",",
      " "
    ),
  };

  return (
    <div
      className={`card ${styles['forecast'] || 'forecast'} forecast ${styles['forecast__container'] || 'forecast__container'} forecast__container ${isGMV ? `${styles['gmv'] || 'gmv'} gmv` : `${styles['orders'] || 'orders'} orders`}`}
    >
      <div className={`${styles['forecast__wrapper'] || 'forecast__wrapper'} forecast__wrapper`}>
        <p className={`${styles['title-h4'] || 'title-h4'} title-h4 ${styles['title'] || 'title'} title`}>{isGMV ? "GMV" : "Orders"}</p>
        {isError ? (<div className={`${styles['forecast__error-message'] || 'forecast__error-message'} forecast__error-message`}>{errorMessage}</div>) : (<>
          <p className={`${styles['forecast__main-amount'] || 'forecast__main-amount'} forecast__main-amount`}>
            {amountPrefix}
            {Formatter.format(Math.floor(amountInPeriod)).replaceAll(",", " ")}
          </p>
          <p className={`${styles['mb'] || 'mb'} mb`}>In period</p>
          <div className="">
            <div className={`grid-row ${styles['forecast__row'] || 'forecast__row'} forecast__row`}>
              <div className={`grid-col-2 ${styles['forecast__col'] || 'forecast__col'} forecast__col`}>
                <p className={`${styles['forecast__amount'] || 'forecast__amount'} forecast__amount`}>
                  {amountPrefix}
                  {amounts.beginOfMonth}
                </p>
                <p className={`${styles['forecast__small-text'] || 'forecast__small-text'} forecast__small-text`}>Month to date</p>
              </div>
              <div className={`grid-col-2 ${styles['line'] || 'line'} line ${styles['forecast__col'] || 'forecast__col'} forecast__col`}>
                <p className={`${styles['forecast__amount'] || 'forecast__amount'} forecast__amount`}>
                  {amountPrefix}
                  {amounts.beginOfYear}
                </p>
                <p className={`${styles['forecast__small-text'] || 'forecast__small-text'} forecast__small-text`}>Year to date</p>
              </div>
            </div>
            <div className={`grid-row ${styles['forecast__row'] || 'forecast__row'} forecast__row`}>
              <div className={`grid-col-2 `}>
                <p className={`${styles['forecast__amount'] || 'forecast__amount'} forecast__amount`}>
                  {amountPrefix}
                  {amounts.forecastByMonth}
                </p>
                <p className={`${styles['forecast__small-text'] || 'forecast__small-text'} forecast__small-text`}>Month forecast</p>
              </div>
              <div className={`grid-col-2 ${styles['line'] || 'line'} line `}>
                <p className={`${styles['forecast__amount'] || 'forecast__amount'} forecast__amount`}>
                  {amountPrefix}
                  {amounts.forecastByYear}
                </p>
                <p className={`${styles['forecast__small-text'] || 'forecast__small-text'} forecast__small-text`}>Year forecast</p>
              </div>
            </div>
          </div>
        </>)}
      </div>
    </div>
  );
};

export default Forecast;
