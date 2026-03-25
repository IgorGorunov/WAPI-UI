import React from "react";
import { OrderByCountryType } from "..";
import CountryBlock from "../CountryBlock";
import styles from "./styles.module.scss";

type PropsType = {
  data: OrderByCountryType[];
};

const CountryList: React.FC<PropsType> = ({ data }) => {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    sum += data[i].ordersCount;
  }

  return (
    <div className={`${styles['country-list'] || 'country-list'} country-list`}>
      <ul className={`${styles['country-list__list'] || 'country-list__list'} country-list__list`}>
        {data &&
          data.map((country: OrderByCountryType, index: number) => (
            <li
              key={country.country + "_" + country.ordersCount + "_" + index}
              className={`${styles['country-list__list-item'] || 'country-list__list-item'} country-list__list-item ${index % 2 === 1 ? `${styles['highlight'] || 'highlight'} highlight` : " "
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
