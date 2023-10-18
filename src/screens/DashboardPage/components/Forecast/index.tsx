import React from "react";
import { ForecastType } from "@/types/dashboard";

import classes from "./Forecast.module.scss";

type ForecastPropsType = {
  type?: ForecastType;
  //periodType: PeriodType;
  amountInPeriod: number;
  beginOfMonth: number;
  beginOfYear: number;
  forecastByMonth: number;
  forecastByYear: number;
};

const Forecast: React.FC<ForecastPropsType> = (props) => {
  const {
    type = "GMV",
    //periodType,
    amountInPeriod,
    beginOfMonth,
    beginOfYear,
    forecastByMonth,
    forecastByYear,
  } = props;

  const isGMV = type === "GMV";
  const amountPrefix = isGMV ? "€" : "";

  const Formatter = Intl.NumberFormat();

  //   const amounts = {
  //     beginOfMonth: isGMV
  //       ? Formatter.format(Math.floor(beginOfMonth))
  //       : Math.floor(beginOfMonth),
  //     beginOfYear: isGMV
  //       ? Formatter.format(Math.floor(beginOfYear))
  //       : Math.floor(beginOfYear),
  //     forecastByMonth: isGMV
  //       ? Formatter.format(Math.floor(forecastByMonth))
  //       : Math.floor(forecastByMonth),
  //     forecastByYear: isGMV
  //       ? Formatter.format(Math.floor(forecastByYear))
  //       : Math.floor(forecastByYear),
  //   };

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
      className={`card ${classes.container} ${
        type === "GMV" ? classes.gmv : null
      }`}
    >
      <div className={classes.wrapper}>
        <h4 className={classes.title}>{isGMV ? "GMV" : "Orders"}</h4>
        <p className={classes["main-amount"]}>
          {amountPrefix}
          {Formatter.format(Math.floor(amountInPeriod)).replaceAll(",", " ")}
        </p>
        <p className={classes.mb}>In period</p>
        <div className="">
          <div className="grid-row">
            <div className={`grid-col-2 ${classes.col}`}>
              <p className={`${classes.amount}`}>
                {amountPrefix}
                {amounts.beginOfMonth}
              </p>
              <p>Begin of month</p>
            </div>
            <div className={`grid-col-2 ${classes.line} ${classes.col}`}>
              <p className={`${classes.amount}`}>
                {amountPrefix}
                {amounts.beginOfYear}
              </p>
              <p>Begin of year</p>
            </div>
          </div>
          <div className="grid-row">
            <div className={`grid-col-2 `}>
              <p className={`${classes.amount}`}>
                {amountPrefix}
                {amounts.forecastByMonth}
              </p>
              <p>Forecast of month</p>
            </div>
            <div className={`grid-col-2 ${classes.line} `}>
              <p className={`${classes.amount}`}>
                {amountPrefix}
                {amounts.forecastByYear}
              </p>
              <p>Forecast of year</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Forecast;
