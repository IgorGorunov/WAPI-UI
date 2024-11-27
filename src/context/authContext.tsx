import React, {createContext, PropsWithChildren, useContext, useState,} from "react";
import Cookie from "js-cookie";
import {UserStatusType} from "@/types/leads";
import useNotifications from "@/context/notificationContext";

export type NavAccessItemType = {
  available: boolean;
  access: string
}

export type ManagerInfoType = {
  name: string;
  email: string;
}

export type UserInfoType = {
    testMode: boolean;
    client: string;
    userLogin: string;
    userName: string;
    supportManager?: ManagerInfoType;
}

export type UserBrowserInfoType = {
  userIp: string;
  userLang: string;
  userTimezone: string;
  userAgentData: any;
}

export type UserAccessActionType = {
  objectType: string;
  action: string;
  forbidden: boolean;
}

export enum AccessObjectTypes {
  none = "none",
  "Finances/CODReports" = "Finances/CODReports",
  "Finances/Invoices" = "Finances/Invoices",
  "Orders/AmazonPrep" = "Orders/AmazonPrep",
  "Orders/Fullfillment" = "Orders/Fullfillment",
  "Products/ProductsList" = "Products/ProductsList",
  "Products/ProductsStock" = "Products/ProductsStock",
  "Reports/CodCheck" = "Reports/CodCheck",
  "Reports/DeliveryRate" = "Reports/DeliveryRate",
  "Reports/ProductsOnStocks" = "Reports/ProductsOnStocks",
  "Reports/SaleDynamic" = "Reports/SaleDynamic",
  "Reports/Sales" = "Reports/Sales",
  "StockManagment/Inbounds" = "StockManagment/Inbounds",
  "StockManagment/LogisticServices" = "StockManagment/LogisticServices",
  "StockManagment/Outbounds" = "StockManagment/Outbounds",
  "StockManagment/StockMovements" = "StockManagment/StockMovements",
  "Tickets" = "Tickets",
  "Profile/Prices" = "Profile/Prices",
  "Profile/Contracts" = "Profile/Contracts",
  "Profile/DeliveryProtocols" = "Profile/DeliveryProtocols",
  "Profile/WarehouseInfo" = "Profile/WarehouseInfo",
  "Profile/ChangePassword" = "Profile/ChangePassword",
}

export enum AccessActions {
  none = "none",
  "ViewObject" = "ViewObject",
  "EditObject" = "EditObject",
  "ExportList" = "ExportList",
  "BulkCreate" = "BulkCreate",
  "ListView" = "ListView",
  "CreateObject" = "CreateObject",
  "GenerateReport" = "GenerateReport",
  "DownloadReport" = "DownloadReport",
  "View" = "View",
  "DownloadPrintForm" = "DownloadPrintForm",
}

type authContextType = {
  token: string | null;
  userName: string | null | undefined;
  setToken: (token: string, isLead?:boolean) => void;
  getToken: () => string | null;
  setUserName: (token: string) => void;
  getUserName: () => string | null;
  currentDate: Date;
  setCurrentDate: (date: string)=>void;
  getCurrentDate: () => Date;
  setTutorialInfo: (str: string[]) => void;
  userStatus: UserStatusType | null;
  getUserStatus: ()=>string | null;
  setUserStatus: (str: string)=>void;
  textInfo: string | null;
  getTextInfo: ()=>string | null;
  setTextInfo: (str: string)=>void;
  logout: ()=>void;
  isAuthorizedUser: ()=>boolean;
  isAuthorizedLead: ()=>boolean;
  isCookieConsentReceived: boolean;
  setCookieConsentReceived: ()=>void;
  setNavItemsAccess: (val: NavAccessItemType[])=>void;
  isNavItemAccessible: (navItemName: string )=>boolean;
  userInfo: UserInfoType;
  setUserInfoProfile: (val: UserInfoType) => void;
  superUser: boolean;
  setIsSuperUser: (isSuperUser: boolean) => void;
  ui: string | null;
  setUserUi: (ui: string | null) => void;

  userBrowserInfo: UserBrowserInfoType | null;
  setUserBrowserInfoFn: (val: UserBrowserInfoType) => void;
  getBrowserInfo: (action: string, objectType?: AccessObjectTypes, actionType?: AccessActions)=>any;
  isActionIsAccessible: (objectType: string, action:string) => boolean;
  setActionAccess: (val: UserAccessActionType[]) => void;

  saveSuperUserName: (val: string)=>void;
};

const AuthContext = createContext<authContextType>({} as authContextType);

const useAuth = (): authContextType => {
  return useContext(AuthContext);
};

export const setCurrentDate = (date: string) => {
  Cookie.set('currentDate', date);
}

export const getCurrentDate = () => {
  const curDate = Cookie.get('currentDate');
  return curDate ? new Date(curDate) : new Date();
}

export const AuthProvider = (props: PropsWithChildren) => {
  const [token, setUserToken] = useState<string|undefined|null>(Cookie.get('token'));
  const [userStatus, setCurrentUserStatus] = useState<UserStatusType|undefined|null>(Cookie.get('userStatus')  as UserStatusType || null);
  const [isCookieConsentReceived, setIsCookieConsentReceived] = useState<boolean>(!!Cookie.get('WAPI_CookieConsent'));
  const [access, setAccess] = useState<string[]>((Cookie.get('WAPI_navAccess') || '').split(';'));
  const getProfileFromCookie = () => {
    const profileInfo = Cookie.get('WAPI_profile_info');
    if (profileInfo && profileInfo !== 'null') {
      return JSON.parse(profileInfo);
    } else return null;
  }

  const getUserBrowserInfo = () => {
    const userBrowserInfo = Cookie.get('userBrowserInfo');
    if (userBrowserInfo && userBrowserInfo !== 'null') {
      return JSON.parse(userBrowserInfo);
    } else return null;
  }

  const [userBrowserInfo, setUserBrowserInfo] = useState<UserBrowserInfoType | null>(getUserBrowserInfo());

  const [userInfo, setUserInfo] = useState<UserInfoType|null>(getProfileFromCookie());

  const [superUser, setSuperUser] = useState<boolean>(Cookie.get('isSU')==='true');
  const [ui, setUi] = useState<string|null>(Cookie.get('ui') || null);

  const setToken = (token:string, isLead=false) => {
    if (isLead) {
      const expireTime = 1/24;
      Cookie.set('token', token, {expires: expireTime});
    } else {
        Cookie.set('token', token);
    }

    setUserToken(token);
  }
  const getToken = () => Cookie.get('token');

  const userName = Cookie.get('userName');
  const setUserName = (userName:string) => Cookie.set('userName', userName);
  const getUserName = () => Cookie.get('userName');

  //current date
  const setCurrentDate = (date: string) => {
    Cookie.set('currentDate', date);
  }

  const setTutorialInfo = (tutorialInfo: string[] | null | undefined) => {

    if (tutorialInfo && Array.isArray(tutorialInfo)) {
      const visitedPages = Cookie.get('tutorialData') || '';
      const visitedPagesArray = visitedPages.split(';') || [];
      const combinedArray = Array.from(new Set([...visitedPagesArray, ...tutorialInfo]));

      Cookie.set('tutorialData', combinedArray.join(';'));
    }
    // tutorialInfo && Array.isArray(tutorialInfo)
    //     ? Cookie.set('tutorialData', tutorialInfo.join(';'))
    //     : Cookie.set('tutorialData', null );
  }

  //const userStatus = Cookie.get('userStatus')  as UserStatusType || null;
  const setUserStatus = (userStatus: string) => {
    Cookie.set('userStatus', userStatus);
    setCurrentUserStatus(userStatus as UserStatusType);
  }
  const getUserStatus = () => Cookie.get('userStatus') as UserStatusType || null;

  const textInfo = Cookie.get('textInfo');
  const setTextInfo = (userStatus: string) => {
    Cookie.set('textInfo', userStatus);
  }
  const getTextInfo = () => Cookie.get('textInfo');


  const currentDate =  Cookie.get('currentDate') ? new Date(Cookie.get('currentDate')) : new Date();

  const {setNotifications} = useNotifications();


  const logout = () => {
    Cookie.remove('token');
    Cookie.remove('userStatus');
    Cookie.remove('userName');
    //Cookie.remove('tutorialData');
    Cookie.remove('textInfo');
    //Cookie.remove('isSU);
    //setIsSuperUser(false);
    //setUserUi('');
    Cookie.remove('isSU')
    Cookie.remove('ui');
    Cookie.remove('WAPI_profile_info');
    Cookie.remove('WAPI_navAccess');
    Cookie.remove('currentDate');

    Cookie.remove('userBrowserInfo');
    Cookie.remove('userActions')

    Cookie.remove('suName');

    setNotifications(null);
    setSuperUserName('')
  }

  const isAuthorizedUser = () => {
    return token && userStatus===UserStatusType.user;
  }

  const isAuthorizedLead = () => {
    return token && userStatus && userStatus!==UserStatusType.user;
  }

  const setCookieConsentReceived = () => {
    Cookie.set('WAPI_CookieConsent', 'true', {expires: 180});
    setIsCookieConsentReceived(true);
  }

  const setNavItemsAccess = (navItemsAccess: NavAccessItemType[]) => {
    const arr:string[] = [];
    navItemsAccess.forEach(item => {
      if (item.available) arr.push(item.access);
    })

    Cookie.set('WAPI_navAccess', arr.join(';'));
    setAccess(arr);
  }

  const isNavItemAccessible = (navItemName: string) => {
    return access.includes(navItemName);
  }

  const getSuNameFromCookie = () => {
    const suName = Cookie.get('suName');
    if (suName) {
      return JSON.stringify(suName);
    }
    return '';
  }
  const [superUserName, setSuperUserName] = useState<string|null>(getSuNameFromCookie());
  const saveSuperUserName = (name: string) => {
    Cookie.set('suName', name.replace('"',''));
    setSuperUserName(name.replace('"',''));
  }

  const setUserInfoProfile = (val: UserInfoType) => {
    setUserInfo(val);
    Cookie.set('WAPI_profile_info', JSON.stringify(val));
  }

  const setIsSuperUser = (isSU: boolean) => {
    Cookie.set('isSU', isSU ? 'true' : 'false');
    setSuperUser(isSU);
  }

  const setUserUi = (ui: string | null) => {
    Cookie.set('ui', ui);
    setUi(ui);
  }

  const setUserBrowserInfoFn = (val: UserBrowserInfoType) => {
    Cookie.set('userBrowserInfo', JSON.stringify(val));
    setUserBrowserInfo(val);
  }

  const getBrowserInfo= (action: string, objectType: AccessObjectTypes, actionType: AccessActions) => {
    const userData = userInfo;
    return {
      headers: [{ip: userBrowserInfo.userIp}, {lang: userBrowserInfo.userLang}, {timezone: userBrowserInfo.userTimezone}, {agent: userBrowserInfo.userAgentData}],
      email: userData?.userLogin || '--',
      clientName: userData.client,
      token: token,
      forbidden: objectType && actionType ? !isActionIsAccessible(objectType, actionType) : false,
      action: action,
      superUserName: superUserName,
    }
  }

  const getUserAccessActions = () => {
    const userAccessActions = Cookie.get('userActions');
    if (userAccessActions && userAccessActions !== 'null') {
      return JSON.parse(userAccessActions);
    } else return null;
  }

  const [accessForActions, setAccessForActions] = useState<UserAccessActionType[] | null>(getUserAccessActions());

  const setActionAccess = (val: UserAccessActionType[]) => {
    Cookie.set('userActions', JSON.stringify(val));
    setAccessForActions(val);
  }
  const isActionIsAccessible = (objectType: string ="", action:string="" ) => {
    if (!accessForActions || !objectType || !action) return true;
    const rez = accessForActions.filter(item => item.objectType==objectType && item.action==action);

    if (rez && rez.length) {
      return !rez[0].forbidden;
    }

    return true;
  }


  return (
      <AuthContext.Provider value={{ token, setToken, getToken, userName, setUserName, getUserName, currentDate, setCurrentDate, getCurrentDate, setTutorialInfo, userStatus, getUserStatus, setUserStatus, textInfo, getTextInfo, setTextInfo, logout, isAuthorizedUser, isAuthorizedLead, isCookieConsentReceived, setCookieConsentReceived, setNavItemsAccess, isNavItemAccessible, userInfo, setUserInfoProfile, superUser, setIsSuperUser, ui, setUserUi, userBrowserInfo, setUserBrowserInfoFn, getBrowserInfo, setActionAccess, isActionIsAccessible, saveSuperUserName }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
