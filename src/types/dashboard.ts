import {DataPoint} from "@/screens/DashboardPage/components/Diagram";
import {GroupOrderStatusType} from "@/screens/DashboardPage/components/OrderStatuses";
import {OrderByCountryType} from "@/screens/DashboardPage/components/OrdersByCountry";

export const enum PeriodTypes {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  CUSTOM = "CUSTOM",
}

export type PeriodType = keyof typeof PeriodTypes;

export type DateRangeType = {
  startDate: Date;
  endDate: Date;
}
export type DashboardPeriodType = {
  startDate: Date;
  endDate: Date;
  periodType: PeriodType;
};

export const enum ForecastTypes {
  GMV = "GMV",
  ORDERS = "Orders",
}

export type ForecastType = keyof typeof ForecastTypes;

export type GmvType = {
  gmvForecastByYear: number,
  gmvForecastByMonth: number,
  gmvBeginOfYear: number,
  gmvBEginOfMonth: number,
  gmvInPeriod: number,
}

// export type OrderByCountryType = {
//   ordersCount: number;
//   country: string;
// }

// export type OrderByStatusType = {
//   ordersCount: number;
//   status: string;
// }
//
// export type OrderByStatusWithStatusesType = {
//   ordersCount: number;
//   status: string;
//   statuses?: OrderByStatusType[];
// }

export type OrdersDiagramType = {
  [PeriodTypes.DAY]: DataPoint[];
  [PeriodTypes.MONTH]: DataPoint[];
  [PeriodTypes.WEEK]: DataPoint[];
}

export type TotalOrdersType = {
  ordersBeginOfYear: number;
  ordersForecastByYear: number;
  ordersForecastByMonth: number;
  ordersBeginOfMonth: number;
  ordersInPeriod: number;
}

export type DashboardDataType = {
  gmv: GmvType;
  orderByCountryArrival: OrderByCountryType[];
  orderByCountryDeparture: OrderByCountryType[];
  ordersByStatuses: GroupOrderStatusType[];
  ordersDiagram: OrdersDiagramType;
  seller?: string;
  totalOrders: TotalOrdersType;
}