import React, {useCallback, useEffect, useRef, useState} from "react";
import useAuth, {AccessActions, AccessObjectTypes} from "@/context/authContext";
import {getDasboardData} from "@/services/dashboard";
import {DashboardDataType, DashboardPeriodType, PeriodType} from "@/types/dashboard";
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
import useTenant from "@/context/tenantContext";
import SeoHead from "@/components/SeoHead";
import {ApiResponseType} from "@/types/api";
import SelectField from "@/components/FormBuilder/Select/SelectField";
import {OptionType} from "@/types/forms";

// type pageDataType = {
//   ordersDiagram: any;
//   gmv: any;
//   totalOrders: any;
//   ordersByStatuses: any;
//   orderByCountryArrival: any;
//   orderByCountryDeparture: any;
// };

const DashboardPage: React.FC = () => {
  const { tenantData } = useTenant();
  const alias = tenantData?.alias;
  const { token, isAuthorizedUser, getBrowserInfo ,superUser, ui, isActionIsAccessible, isNavItemAccessible, needSeller, sellersList } = useAuth();

  const currentDate = new Date();

  useEffect(() => {
    if (!isAuthorizedUser) Router.push(Routes.Login);
  }, [token]);

  const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
  const [sellersOptions, setSellersOptions] = useState<OptionType[]>([]);

  const [pageDataArr, setPageDataArr] = useState<DashboardDataType[]>([]);
  const [data, setData] = useState<string>('');
  const [sellerData, setSellerData] = useState<DashboardDataType | null>(null);

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
      alias,
    };
  },[token]);

  const lastValidPageData = useRef<DashboardDataType[]>([]);

  useEffect(() => {

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

        if (isActionIsAccessible(AccessObjectTypes["Dashboard"], AccessActions.View) && isNavItemAccessible('Dashboard')) {
          const res: ApiResponseType = await getDasboardData(superUser && ui ? {...requestData, ui} : requestData);

          if (res && res.status === 200 && "data" in res) {
            setPageDataArr(res.data);

            if (Array.isArray(res.data)) {
               if (res.data.length > 0) {
                 setData(JSON.stringify(res.data));
                 lastValidPageData.current = res.data;
                 // setSellerData(res.data[0]);
                 if (selectedSeller) {
                   setSellerData(res.data.find(item => item.seller === selectedSeller));
                 } else {
                   setSelectedSeller(res.data[0].seller);
                   setSellerData(res.data[0]);
                 }

                 setSellersOptions(res.data.map(item => {
                   const seller = sellersList.find(s => s.value === item.seller);
                   return {label: seller ? seller.label : ' - ', value: item.seller}
                 }));
               } else {
                 //no data received
                 setSellerData({} as DashboardDataType);
               }
            }
            setIsLoading(false);
          } else {
            console.error("API did not return expected data");
          }
        } else {
          setPageDataArr([]);
          console.log('no access');
          setIsLoading(false);
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
      if (!isLoading && pageDataArr) {
        setTimeout(() => setRunTour(true), 1000);
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (selectedSeller && data) {
          const selectedSellerData = JSON.parse(data).find(s => s.seller === selectedSeller);



          if (selectedSellerData) {
            setSellerData(selectedSellerData);
            setSelectedSeller(selectedSeller);
            return;
          }
        }
  }, [selectedSeller]);

 // const handleSellerChange = (selectedSeller: string) => {
 //   console.log('selectedSeller: ', selectedSeller, pageDataArr, !data);
 //   console.log('Fallback data:', lastValidPageData.current);
 //
 //   if (selectedSeller && data) {
 //     const selectedSellerData = JSON.parse(data).find(s => s.seller === selectedSeller);
 //
 //
 //
 //     if (selectedSellerData) {
 //       setSellerData(selectedSellerData);
 //       setSelectedSeller(selectedSeller);
 //       return;
 //     }
 //   }
 //
 //   // setSellerData(null);
 // }

  return (
      <Layout hasHeader hasFooter>
        <SeoHead title='Dashboard' description='Our dashboard page' />
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
          {(isActionIsAccessible(AccessObjectTypes["Dashboard"], AccessActions.View) && isNavItemAccessible('Dashboard')) ? (
              <div>
                { sellersList && needSeller() ?
                    <div className='seller-filter-block under-header-seller-filter'>
                      <SelectField
                          key='seller-filter'
                          name='selectedSeller'
                          label='Seller: '
                          value={selectedSeller}
                          // onChange={(val)=>handleSellerChange(val as  string)}
                          onChange={(val)=>setSelectedSeller(val as  string)}
                          //options={[{label: 'All sellers', value: 'All sellers'}, ...sellersList]}
                          options={sellersOptions}
                          classNames='seller-filter full-sized'
                          isClearable={false}
                      />
                    </div>
                    : null
                }
                {sellerData !==null ? <div>
              <div className="dashboard-animated-grid grid-row dashboard-grid-row">
                <div className="width-33 dashboard-grid-col">
                  <Forecast
                      type="GMV"
                      amountInPeriod={!sellerData.gmv?.gmvInPeriod ? 0 : sellerData.gmv?.gmvInPeriod}
                      beginOfMonth={!sellerData.gmv?.gmvBEginOfMonth ? 0 : sellerData.gmv?.gmvBEginOfMonth}
                      beginOfYear={!sellerData.gmv?.gmvBeginOfYear ? 0 : sellerData.gmv?.gmvBeginOfYear}
                      forecastByMonth={!sellerData.gmv?.gmvForecastByMonth ? 0 : sellerData.gmv?.gmvForecastByMonth}
                      forecastByYear={!sellerData.gmv?.gmvForecastByYear ? 0 : sellerData.gmv?.gmvForecastByYear}
                      //temporary
                      isError = {false}
                      errorMessage='This indicator is temporarily unavailable due to technical work until 22.01.2024'
                  />
                </div>
                <div className="width-33 dashboard-grid-col">
                  <OrderStatuses ordersByStatuses={sellerData.ordersByStatuses}/>
                </div>
                <div className="width-33 dashboard-grid-col">
                  <Forecast
                      type="ORDERS"
                      amountInPeriod={!sellerData.totalOrders?.ordersInPeriod ? 0 : sellerData.totalOrders?.ordersInPeriod}
                      beginOfMonth={!sellerData.totalOrders?.ordersInPeriod ? 0 : sellerData.totalOrders?.ordersBeginOfMonth}
                      beginOfYear={!sellerData.totalOrders?.ordersBeginOfYear ? 0 : sellerData.totalOrders?.ordersBeginOfYear}
                      forecastByMonth={!sellerData.totalOrders?.ordersForecastByMonth ? 0 : sellerData.totalOrders?.ordersForecastByMonth}
                      forecastByYear={!sellerData.totalOrders?.ordersForecastByYear ? 0 : sellerData.totalOrders?.ordersForecastByYear}
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
                        diagramData={sellerData.ordersDiagram}
                        setDiagramType={setDiagramType}
                        diagramType={diagramType}
                    />
              }
              {
                <OrdersByCountry
                    arrival={!sellerData.orderByCountryArrival ? [] : sellerData.orderByCountryArrival}
                    departure={!sellerData.orderByCountryDeparture ? [] : sellerData.orderByCountryDeparture}
                />
              }
                    </div> : null }
              {sellerData && runTour && dashboardSteps ? <TourGuide steps={dashboardSteps} run={runTour} pageName={TourGuidePages.Dashboard} /> : null}

              </div>) : null}
        </div>

      </Layout>
  );
};

export default DashboardPage;
