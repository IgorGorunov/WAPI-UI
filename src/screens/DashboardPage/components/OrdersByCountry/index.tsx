import React, { useState } from "react";
import { Country } from "@/types/countries";
import CountryList from "./CountryList";
import "./styles.scss";

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

  return (
    <div className={`orders-by-country orders-by-country__container card mb-md`}>
      <h4 className="title">Orders by contries</h4>
      <div className="orders-by-country__wrapper">
        <ul className="orders-by-country__tablist" role="tablist">
          <li
            className={`tab ${
              activeTab === 0 ? "active-tab" : ""
            }`}
            key="departure"
          >
            <a
              key="tab-0"
              className="tab-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(0);
              }}
              role="tab"
              aria-controls="panel-id-0"
              aria-selected={activeTab === 0}
              id="tab-id-0"
            >
              By country of departure
            </a>
          </li>
          <li
            className={`tab ${
              activeTab === 1 ? "active-tab" : ""
            }`}
            key="arrival"
          >
            <a
              key="tab-1"
              className="tab-link"
              href="#"
              onClick={(event) => {
                event.preventDefault();
                setActiveTab(1);
              }}
              role="tab"
              aria-controls="panel-id-1"
              aria-selected={activeTab === 1}
              id="tab-id-1"
            >
              By country of arrival
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
