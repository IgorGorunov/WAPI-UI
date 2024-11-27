import React, {useCallback, useEffect, useState} from "react";
import useAuth from "@/context/authContext";
import {getDasboardData} from "@/services/dashboard";
import {DashboardPeriodType, PeriodType} from "@/types/dashboard";
import Layout from "@/components/Layout/Layout";
import Header from "@/components/Header"
import Diagram from "./components/Diagram";
import Forecast from "./components/Forecast";
import OrderStatuses from "./components/OrderStatuses";
import OrdersByCountry from "./components/OrdersByCountry";
import "./styles.scss";
import PeriodFilter from "@/screens/DashboardPage/components/PeriodFilter";
import {formatDateToString} from "@/utils/date";
import Loader from "@/components/Loader";
import TourGuide from "@/components/TourGuide";
import useTourGuide from "@/context/tourGuideContext";
import {dashboardSteps} from "@/screens/DashboardPage/dashboardTourGuideSteps.constants";
import {TourGuidePages} from "@/types/tourGuide";
import {Routes} from "@/types/routes";
import Router from "next/router";
import {sendUserBrowserInfo} from "@/services/userInfo";

type pageDataType = {
  ordersDiagram: any;
  gmv: any;
  totalOrders: any;
  ordersByStatuses: any;
  orderByCountryArrival: any;
  orderByCountryDeparture: any;
};

const DashboardPage: React.FC = () => {

  const { token, currentDate, isAuthorizedUser, superUser, ui, getBrowserInfo } = useAuth();

  useEffect(() => {
    if (!isAuthorizedUser) Router.push(Routes.Login);
  }, [token]);

  const [pageData, setPageData] = useState<pageDataType | null>(null);

  const [currentPeriod, setCurrentPeriod] = useState<DashboardPeriodType>({
    startDate: new Date(new Date().setDate(currentDate.getDate() - 30 + 1)),
    endDate: currentDate,
    periodType: "MONTH" as PeriodType,
  });

  const [clickedPeriod, setClickedPeriod] = useState<PeriodType>("MONTH");
  const [diagramType, setDiagramType] = useState<PeriodType>("DAY");
  const [isLoading, setIsLoading] = useState(true);

  const createRequestData = useCallback((
      startDate: Date,
      endDate: Date
  ) => {
    return {
      startDate: formatDateToString(startDate),
      endDate: formatDateToString(endDate),
      token: token || "",
    };
  },[token]);

  useEffect(() => {
    type ApiResponse = {
      data: any;
    };

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const requestData = createRequestData(
            currentPeriod.startDate,
            currentPeriod.endDate
        );

        try {
          sendUserBrowserInfo({...getBrowserInfo('GetDashboardData'), body: superUser && ui ? {...requestData, ui} : requestData})
        } catch {}

        const res: ApiResponse = await getDasboardData(superUser && ui ? {...requestData, ui} : requestData);

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
  }, [token, currentPeriod, superUser, ui]);

  //tour guide
  const {runTour, setRunTour, isTutorialWatched} = useTourGuide();

  useEffect(() => {
    if (!isTutorialWatched(TourGuidePages.Dashboard)) {
      if (!isLoading && pageData) {
        setTimeout(() => setRunTour(true), 1000);
      }
    }
  }, [isLoading]);

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
          {isLoading && <Loader />}
          <div className='header'>
            <Header pageTitle="Dashboard" needTutorialBtn>
            {/*<Header pageTitle="Dashboard" >*/}
              <PeriodFilter currentPeriod={currentPeriod}
                  setCurrentPeriod={setCurrentPeriod}
                  setDiagramType={setDiagramType}
                  clickedPeriod={clickedPeriod}
                  setClickedPeriod={setClickedPeriod} />
            </Header>
          </div>
          <div className="dashboard-animated-grid grid-row dashboard-grid-row">
            <div className="width-33 dashboard-grid-col">
              <Forecast
                  type="GMV"
                  amountInPeriod={!gmv?.gmvInPeriod ? 0 : gmv?.gmvInPeriod}
                  beginOfMonth={!gmv?.gmvBEginOfMonth ? 0 : gmv?.gmvBEginOfMonth}
                  beginOfYear={!gmv?.gmvBeginOfYear ? 0 : gmv?.gmvBeginOfYear}
                  forecastByMonth={!gmv?.gmvForecastByMonth ? 0 : gmv?.gmvForecastByMonth}
                  forecastByYear={!gmv?.gmvForecastByYear ? 0 : gmv?.gmvForecastByYear}
                  //temporary
                  isError = {false}
                  errorMessage='This indicator is temporarily unavailable due to technical work until 22.01.2024'
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
          {pageData && runTour && dashboardSteps ? <TourGuide steps={dashboardSteps} run={runTour} pageName={TourGuidePages.Dashboard} /> : null}
        </div>

      </Layout>
  );
};

export default DashboardPage;
