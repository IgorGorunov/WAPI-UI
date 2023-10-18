import React from "react";
import { OrderByCountryType } from "..";
import { CountryCodes } from "@/types/countries";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import classes from "./CountryBlock.module.scss";

type CountryBlockProps = OrderByCountryType & {
  sum: number;
};

const CountryBlock: React.FC<CountryBlockProps> = ({
  country,
  ordersCount,
  sum = 0,
}) => {
  const barWidth = sum === 0 ? 0 : Math.round((ordersCount / sum) * 100) + "%";
  const countryCode = CountryCodes[country];

  return (
    <div className={classes.wrapper}>
      <div className={classes.flag}>
        <span className={`fi fi-${countryCode} ${classes["flag-icon"]}`}></span>
      </div>
      <div className={classes.name}>{country}</div>
      <div className={classes.bar}>
        <div
          style={{
            background: "#5380F5",
            height: "5px",
            width: barWidth,
            borderRadius: "2px",
          }}
        ></div>
      </div>
      <div className={classes.count}>{ordersCount}</div>
    </div>
  );
};

export default CountryBlock;
