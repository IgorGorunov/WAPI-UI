const formatDateToString = (date: Date) => {
    let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = "" +d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (year.length === 1) year = "000"+year;

    return [year, month, day].join("-");
};

const formatDateTimeToStringWithDot = (dateStr: string) => {
    const curDate = new Date(dateStr);
    return curDate.toLocaleDateString('en-GB').split('/').join('.')+' '+curDate.toLocaleTimeString('en-GB');
}

const formatDateToDisplayString = (date: Date) => {
    let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = "" +d.getFullYear();

    if (year==="1") return '';

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (year.length === 1) year = "000"+year;

    return [day, month, year].join(".");
};

const formatDateStringToDisplayString = (dateString: string) => {
    if (dateString === '0001-01-01T00:00:00') return "";
    return formatDateToDisplayString(new Date(dateString));
}

const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

const getFirstDayOfYear = (date: Date) => {
    return new Date(date.getFullYear(), 0, 1);
};

const getLastFewDays = (date: Date, days: number) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() - days);
}


const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatDateToShowMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

const formatDateToWeekRange = (dateStr: string) => {
    const startDate = new Date(dateStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    return `${startDate.getDate()} ${MONTHS[startDate.getMonth()]} ${startDate.getFullYear()} - ${endDate.getDate()} ${MONTHS[endDate.getMonth()]} ${endDate.getFullYear()}`;
}



export {
    formatDateToString,
    formatDateTimeToStringWithDot,
    formatDateStringToDisplayString,
    getFirstDayOfMonth,
    formatDateToDisplayString,
    getFirstDayOfYear,
    getLastFewDays,
    formatDateToShowMonthYear,
    formatDateToWeekRange,
}