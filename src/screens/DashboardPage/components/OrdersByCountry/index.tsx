import React, { useState } from "react";
import {Country, CountryCodeType} from "@/types/countries";
import CountryList from "./CountryList";
import "./styles.scss";
import {useTranslations} from "next-intl";

export type OrderByCountryType = {
  ordersCount: number;
  country: Country;
};

type OrdersByCountryPropsType = {
  arrival?: OrderByCountryType[] | null;
  departure?: OrderByCountryType[] | null;
};

const OrdersByCountry: React.FC<OrdersByCountryPropsType> = ({
  arrival,
  departure,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const t = useTranslations('Dashboard.ordersByCountries')
  return (
    <div className={`orders-by-country orders-by-country__container card mb-md`}>
      <p className="title-h4 title">{t('title')}</p>
      <div className="orders-by-country__wrapper">
        <ul className="orders-by-country__tablist" role="tablist">
          <li
            className={`tab ${
              activeTab === 0 ? "active-tab" : ""
            } orders-by-country-of-departure`}
            key="departure"
            role="tab"
            aria-controls="panel-id-0"
            aria-selected={activeTab === 0}
            id="tab-id-0"
          >
            <a
              key="tab-0"
              className="tab-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(0);
              }}
            >
              {/*By country of departure*/}
              {t('tabTitle1')}
            </a>
          </li>
          <li
            className={`tab ${
              activeTab === 1 ? "active-tab" : ""
            } orders-by-country-of-arrival`}
            key="arrival"
            role="tab"
            aria-controls="panel-id-1"
            aria-selected={activeTab === 1}
            id="tab-id-1"
          >
            <a
              key="tab-1"
              className="tab-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(1);
              }}

            >
              {/*By country of arrival*/}
              {t('tabTitle2')}
            </a>
          </li>
        </ul>
        <div className="orders-by-country__content">
          <div
            key="tabpanel-0"
            className="panel"
            hidden={activeTab !== 0}
            role="tabpanel"
            aria-labelledby="tab-id-0"
            id="panel-id-0"
          >
            {departure && <CountryList data={departure} />}
          </div>
          <div
            key="tabpanel-1"
            className="panel"
            hidden={activeTab !== 1}
            role="tabpanel"
            aria-labelledby="tab-id-1"
            id="panel-id-1"
          >
            {arrival && <CountryList data={arrival} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersByCountry;
