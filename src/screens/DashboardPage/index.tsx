import React, { useState, useEffect } from "react";
import Cookie from 'js-cookie';
import useAuth from "@/context/authContext";
import {useRouter} from "next/router";
import { getDasboardData } from "@/services/dashboard";
import {
  PeriodType,
  DashboardPeriodType,
} from "@/types/dashboard";
import {Routes} from "@/types/routes";
import Layout from "@/components/Layout/Layout";
import Header from "./components/Header";
import Diagram from "./components/Diagram";
import Forecast from "./components/Forecast";
import OrderStatuses from "./components/OrderStatuses";
import OrdersByCountry from "./components/OrdersByCountry";
import "./styles.scss";
import {verifyToken} from "@/services/auth";

const DashboardPage: React.FC = () => {

  type pageDataType = {
    ordersDiagram: any;
    gmv: any;
    totalOrders: any;
    ordersByStatuses: any;
    orderByCountryArrival: any;
    orderByCountryDeparture: any;
  };

  const formatDate = (date: Date) => {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const Router = useRouter();
  console.log("router: ", Router);
  const { token, setToken } = useAuth();
  const savedToken = Cookie.get('token');
  if (!token && savedToken) setToken(savedToken);

  // if (!token ) router.push("/login");

  const [pageData, setPageData] = useState<pageDataType | null>(null);

  const [currentPeriod, setCurrentPeriod] = useState<DashboardPeriodType>({
    startDate: new Date(),
    endDate: new Date(),
    periodType: "DAY" as PeriodType,
  });

  const [clickedPeriod, setClickedPeriod] = useState<PeriodType>("DAY");
  const [diagramType, setDiagramType] = useState<PeriodType>("DAY");

  useEffect(() => {
    type ApiResponse = {
      data: any;
    };

    const createRequestData = (
      periodType: PeriodType,
      startDate: Date,
      endDate: Date
    ) => {
      return {
        periodType,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        token: token || "",
      };
    };


    const fetchData = async () => {
      try {
        //verify token
        if (!await verifyToken(token)) {
            console.log("token is wrong");
            await Router.push(Routes.Login);
        }

        const res: ApiResponse = await getDasboardData(
          createRequestData(
            currentPeriod.periodType,
            currentPeriod.startDate,
            currentPeriod.endDate
          )
        );

        if (res && "data" in res) {
          setPageData(res.data);
        } else {
          console.error("API did not return expected data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, currentPeriod]);

  console.log("page data: ", pageData);

  const gmv = pageData && pageData.gmv ? pageData.gmv : null;
  const orders = pageData && pageData.totalOrders ? pageData.totalOrders : null;
  const ordersByStatuses =
    pageData && pageData.ordersByStatuses ? pageData.ordersByStatuses : null;

  const orderByCountryArrival =
    pageData && pageData.orderByCountryArrival
      ? pageData.orderByCountryArrival
      : null;

  const orderByCountryDeparture =
    pageData && pageData.orderByCountryDeparture
      ? pageData.orderByCountryDeparture
      : null;

  return (
    <Layout hasHeader hasFooter>
      <div className="dashboard-page__container">
        <Header
          currentPeriod={currentPeriod}
          setCurrentPeriod={setCurrentPeriod}
          setDiagramType={setDiagramType}
          clickedPeriod={clickedPeriod}
          setClickedPeriod={setClickedPeriod}
        />
        <div className="grid-row gap-md mb-md">
          <div className="grid-col-3">
            {pageData?.gmv && (
              <Forecast
                type="GMV"
                amountInPeriod={gmv?.gmvInPeriod}
                beginOfMonth={gmv?.gmvBEginOfMonth}
                beginOfYear={gmv?.gmvBeginOfYear}
                forecastByMonth={gmv?.gmvForecastByMonth}
                forecastByYear={gmv?.gmvForecastByYear}
              />
            )}
          </div>
          <div className="grid-col-3">
            {ordersByStatuses && (
              <OrderStatuses ordersByStatuses={ordersByStatuses} />
            )}
          </div>
          <div className="grid-col-3">
            {orders && (
              <Forecast
                type="ORDERS"
                amountInPeriod={orders?.ordersInPeriod}
                beginOfMonth={orders?.ordersBeginOfMonth}
                beginOfYear={orders?.ordersBeginOfYear}
                forecastByMonth={orders?.ordersForecastByMonth}
                forecastByYear={orders?.ordersForecastByYear}
              />
            )}
          </div>
        </div>
        {pageData && (
          <Diagram
            diagramData={pageData.ordersDiagram}
            setDiagramType={setDiagramType}
            diagramType={diagramType}
          />
        )}
        {(orderByCountryArrival || orderByCountryDeparture) && (
          <OrdersByCountry
            arrival={orderByCountryArrival}
            departure={orderByCountryDeparture}
          />
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
