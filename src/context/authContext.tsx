import React, {
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import Cookie from "js-cookie";

type authContextType = {
  token: string | null;
  userName: string | null | undefined;
  setToken: (token: string) => void;
  getToken: () => string | null;
  setUserName: (token: string) => void;
  getUserName: () => string | null;
  currentDate: Date;
  setCurrentDate: (date: string)=>void;
  getCurrentDate: () => Date;
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
  const token = Cookie.get('token');
  const setToken = (token:string) => Cookie.set('token', token);
  const getToken = () => Cookie.get('token');

  const userName = Cookie.get('userName');
  const setUserName = (userName:string) => Cookie.set('userName', userName);
  const getUserName = () => Cookie.get('userName');

  //current date
  const setCurrentDate = (date: string) => {
    Cookie.set('currentDate', date);
  }


  const currentDate =  Cookie.get('currentDate') ? new Date(Cookie.get('currentDate')) : new Date();


  return (
    <AuthContext.Provider value={{ token, setToken, getToken, userName, setUserName, getUserName, currentDate, setCurrentDate, getCurrentDate }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
