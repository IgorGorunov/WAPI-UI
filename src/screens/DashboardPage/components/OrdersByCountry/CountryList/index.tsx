import React from "react";
import { OrderByCountryType } from "..";
import CountryBlock from "../CountryBlock";
import classes from "./CountryList.module.scss";

type PropsType = {
  data: OrderByCountryType[];
};

const CountryList: React.FC<PropsType> = ({ data }) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].ordersCount;
  }

  return (
    <div className={classes.wrapper}>
      <ul className={classes.list}>
        {data &&
          data.map((country: OrderByCountryType, index: number) => (
            <li
              key={country.country + "_" + country.ordersCount + "_" + index}
              className={` ${classes["list-item"]} ${
                index % 2 === 1 ? classes.highlight : " "
              }`}
            >
              <CountryBlock {...country} sum={sum} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default CountryList;
