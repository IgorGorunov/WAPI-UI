export const enum PeriodTypes {
  DAY = "DAY",
  WEEK = "WEEK",
  MONTH = "MONTH",
  QUARTER = "QUARTER",
  YEAR = "YEAR",
  CUSTOM = "CUSTOM",
}

export type PeriodType = keyof typeof PeriodTypes;

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
