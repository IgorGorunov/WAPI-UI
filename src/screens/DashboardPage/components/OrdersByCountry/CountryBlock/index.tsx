import React from "react";
import { OrderByCountryType } from "..";
import { CountryCodes } from "@/types/countries";
import styles from "./styles.module.scss";

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
    <div className={`${styles['country-block'] || 'country-block'} country-block ${styles['country-block__wrapper'] || 'country-block__wrapper'} country-block__wrapper`}>
      <div className={`${styles['flag'] || 'flag'} flag`}>
        <span className={`fi fi-${countryCode} ${styles['flag-icon'] || 'flag-icon'} flag-icon`}></span>
      </div>
      <div className={`${styles['country-block__name'] || 'country-block__name'} country-block__name`}>{country}</div>
      <div className={`${styles['country-block__bar'] || 'country-block__bar'} country-block__bar`}>
        <div
          style={{
            background: "#5380F5",
            height: "5px",
            width: barWidth,
            borderRadius: "2px",
          }}
        ></div>
      </div>
      <div className={`${styles['country-block__count'] || 'country-block__count'} country-block__count`}>{ordersCount}</div>
    </div>
  );
};

export default CountryBlock;
