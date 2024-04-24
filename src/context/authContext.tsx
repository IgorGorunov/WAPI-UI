import React, {createContext, PropsWithChildren, useContext, useState,} from "react";
import Cookie from "js-cookie";
import {UserStatusType} from "@/types/leads";

type NavAccessItemType = {
  available: boolean;
  access: string
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
  isNavItemAccessible: (navItemName: string )=>boolean
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
    tutorialInfo && Array.isArray(tutorialInfo)
        ? Cookie.set('tutorialData', tutorialInfo.join(';'))
        : Cookie.set('tutorialData', null );
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


  const logout = () => {
    setToken('');
    setUserStatus('');
    setUserName('');
    setTutorialInfo(['']);
    setTextInfo('');
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



  return (
    <AuthContext.Provider value={{ token, setToken, getToken, userName, setUserName, getUserName, currentDate, setCurrentDate, getCurrentDate, setTutorialInfo, userStatus, getUserStatus, setUserStatus, textInfo, getTextInfo, setTextInfo, logout, isAuthorizedUser, isAuthorizedLead, isCookieConsentReceived, setCookieConsentReceived, setNavItemsAccess, isNavItemAccessible }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
