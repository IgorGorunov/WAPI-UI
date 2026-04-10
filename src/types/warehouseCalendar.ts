
export type CalendarDayType = {
    date: string;
    dayKind: string;
}
export type WarehouseCalendarType = {
    id: number,
    warehouse: string,
    days: CalendarDayType[],
    workingTime: string;
    timeZone: number;
}