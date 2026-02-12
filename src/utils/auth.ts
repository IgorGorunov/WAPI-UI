import Cookie from "js-cookie";

export const setCurrentDate = (date: string) => {
    Cookie.set('currentDate', date, { path: '/' });
}

export const getCurrentDate = () => {
    const curDate = Cookie.get('currentDate');
    return curDate ? new Date(curDate) : new Date();
}
