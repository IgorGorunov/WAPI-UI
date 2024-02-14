import React from "react";
import { ForecastType } from "@/types/dashboard";
import "./styles.scss";

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
          className={`card forecast forecast__container ${isGMV ? "gmv" : ""}`}
      >
          <div className="forecast__wrapper">
            <h4 className="title">{isGMV ? "GMV" : "Orders"}</h4>
            {isError ? (<div className='forecast__error-message'>{errorMessage}</div>) : (<>
              <p className="forecast__main-amount">
                {amountPrefix}
                {Formatter.format(Math.floor(amountInPeriod)).replaceAll(",", " ")}
              </p>
              <p className="mb">In period</p>
              <div className="">
                <div className="grid-row forecast__row">
                  <div className={`grid-col-2 forecast__col`}>
                    <p className={`forecast__amount`}>
                      {amountPrefix}
                      {amounts.beginOfMonth}
                    </p>
                    <p>Month to date</p>
                  </div>
                  <div className={`grid-col-2 line forecast__col`}>
                    <p className={`forecast__amount`}>
                      {amountPrefix}
                      {amounts.beginOfYear}
                    </p>
                    <p>Year to date</p>
                  </div>
                </div>
                <div className="grid-row forecast__row">
                  <div className={`grid-col-2 `}>
                    <p className={`forecast__amount`}>
                      {amountPrefix}
                      {amounts.forecastByMonth}
                    </p>
                    <p>Month forecast</p>
                  </div>
                  <div className={`grid-col-2 line `}>
                    <p className={`forecast__amount`}>
                      {amountPrefix}
                      {amounts.forecastByYear}
                    </p>
                    <p>Year forecast</p>
                  </div>
                </div>
              </div>
            </>)}
          </div>
      </div>
  );
};

export default Forecast;
