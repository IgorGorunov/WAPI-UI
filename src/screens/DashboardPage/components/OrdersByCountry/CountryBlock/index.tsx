import React from "react";
import { OrderByCountryType } from "..";
import { CountryCodes } from "@/types/countries";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import "./styles.scss";
import {useTranslations} from "next-intl";

type CountryBlockProps = OrderByCountryType & {
  sum: number;
};

const CountryBlock: React.FC<CountryBlockProps> = ({
  country,
  ordersCount,
  sum = 0,
}) => {
    const t = useTranslations('countries');

  const barWidth = sum === 0 ? 0 : Math.round((ordersCount / sum) * 100) + "%";
  const countryCode = CountryCodes[country] || "noCountry";

  return (
    <div className="country-block country-block__wrapper">
      <div className="flag">
        <span className={`fi fi-${countryCode} "flag-icon"`}></span>
      </div>
      <div className="country-block__name">{t(countryCode)}</div>
      <div className="country-block__bar">
        <div
          style={{
            background: "#5380F5",
            height: "5px",
            width: barWidth,
            borderRadius: "2px",
          }}
        ></div>
      </div>
      <div className="country-block__count">{ordersCount}</div>
    </div>
  );
};

export default CountryBlock;
