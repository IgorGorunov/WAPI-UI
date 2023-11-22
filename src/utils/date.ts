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

const formatDateToDisplayString = (date: Date) => {
    let d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = "" +d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (year.length === 1) year = "000"+year;

    return [day, month, year].join(".");
};

const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
}

export {formatDateToString, getFirstDayOfMonth,formatDateToDisplayString}