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
//import Header from "./components/Header";
import Header from "@/components/Header"
import Diagram from "./components/Diagram";
import Forecast from "./components/Forecast";
import OrderStatuses from "./components/OrderStatuses";
import OrdersByCountry from "./components/OrdersByCountry";
import "./styles.scss";
import {verifyToken} from "@/services/auth";
import Skeleton from "@/components/Skeleton/Skeleton";
import PeriodFilter from "@/screens/DashboardPage/components/PeriodFilter";
import {formatDateToString} from "@/utils/date";

const DashboardPage: React.FC = () => {

  type pageDataType = {
    ordersDiagram: any;
    gmv: any;
    totalOrders: any;
    ordersByStatuses: any;
    orderByCountryArrival: any;
    orderByCountryDeparture: any;
  };



  const Router = useRouter();
  const { token, setToken } = useAuth();
  const savedToken = Cookie.get('token');
  if (savedToken) setToken(savedToken);

  const [pageData, setPageData] = useState<pageDataType | null>(null);

  const [currentPeriod, setCurrentPeriod] = useState<DashboardPeriodType>({
    startDate: new Date(),
    endDate: new Date(),
    periodType: "DAY" as PeriodType,
  });

  const [clickedPeriod, setClickedPeriod] = useState<PeriodType>("DAY");
  const [diagramType, setDiagramType] = useState<PeriodType>("DAY");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    type ApiResponse = {
      data: any;
    };

    const createRequestData = (
      startDate: Date,
      endDate: Date
    ) => {
      return {
        startDate: formatDateToString(startDate),
        endDate: formatDateToString(endDate),
        token: token || "",
      };
    };


    const fetchData = async () => {
      try {
        setIsLoading(true);
        //verify token
        if (!await verifyToken(token)) {
            await Router.push(Routes.Login);
        }

        const res: ApiResponse = await getDasboardData(
          createRequestData(
            currentPeriod.startDate,
            currentPeriod.endDate
          )
        );

        if (res && "data" in res) {
          setPageData(res.data);
          setIsLoading(false);
        } else {
          console.error("API did not return expected data");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, currentPeriod]);



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
          {isLoading && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                zIndex: 1000
              }}>
                <Skeleton type="round" width="500px" height="300px" />
              </div>
          )}

          {/*<Header*/}
          {/*    currentPeriod={currentPeriod}*/}
          {/*    setCurrentPeriod={setCurrentPeriod}*/}
          {/*    setDiagramType={setDiagramType}*/}
          {/*    clickedPeriod={clickedPeriod}*/}
          {/*    setClickedPeriod={setClickedPeriod}*/}
          {/*/>*/}
          <Header pageTitle="Dashboard">
            <PeriodFilter currentPeriod={currentPeriod}
                setCurrentPeriod={setCurrentPeriod}
                setDiagramType={setDiagramType}
                clickedPeriod={clickedPeriod}
                setClickedPeriod={setClickedPeriod} />
          </Header>
          <div className="dashboard-animated-grid grid-row dashboard-grid-row">
            <div className="width-33 dashboard-grid-col">
              <Forecast
                  type="GMV"
                  amountInPeriod={!gmv?.gmvInPeriod ? 0 : gmv?.gmvInPeriod}
                  beginOfMonth={!gmv?.gmvBEginOfMonth ? 0 : gmv?.gmvBEginOfMonth}
                  beginOfYear={!gmv?.gmvBeginOfYear ? 0 : gmv?.gmvBeginOfYear}
                  forecastByMonth={!gmv?.gmvForecastByMonth ? 0 : gmv?.gmvForecastByMonth}
                  forecastByYear={!gmv?.gmvForecastByYear ? 0 : gmv?.gmvForecastByYear}
              />
            </div>
            <div className="width-33 dashboard-grid-col">
              <OrderStatuses ordersByStatuses={ordersByStatuses}/>
            </div>
            <div className="width-33 dashboard-grid-col">
              <Forecast
                  type="ORDERS"
                  amountInPeriod={!orders?.ordersInPeriod ? 0 : orders?.ordersInPeriod}
                  beginOfMonth={!orders?.ordersInPeriod ? 0 : orders?.ordersBeginOfMonth}
                  beginOfYear={!orders?.ordersBeginOfYear ? 0 : orders?.ordersBeginOfYear}
                  forecastByMonth={!orders?.ordersForecastByMonth ? 0 : orders?.ordersForecastByMonth}
                  forecastByYear={!orders?.ordersForecastByYear ? 0 : orders?.ordersForecastByYear}
              />
            </div>
          </div>
          {
            isLoading
                ?
                <Diagram
                    diagramData={null}
                    setDiagramType={setDiagramType}
                    diagramType={diagramType}
                />
                : <Diagram
                    diagramData={pageData.ordersDiagram}
                    setDiagramType={setDiagramType}
                    diagramType={diagramType}
                />
          }
          {
            <OrdersByCountry
                arrival={!orderByCountryArrival ? [] : orderByCountryArrival}
                departure={!orderByCountryDeparture ? [] : orderByCountryDeparture}
            />
          }
        </div>
      </Layout>
  );
};

export default DashboardPage;
