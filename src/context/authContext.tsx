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
};

const AuthContext = createContext<authContextType>({} as authContextType);

const useAuth = (): authContextType => {
  return useContext(AuthContext);
};

export const AuthProvider = (props: PropsWithChildren) => {
  const token = Cookie.get('token');
  const setToken = (token:string) => Cookie.set('token', token);
  const getToken = () => Cookie.get('token');

  const userName = Cookie.get('userName');
  const setUserName = (userName:string) => Cookie.set('userName', userName);
  const getUserName = () => Cookie.get('userName');

  return (
    <AuthContext.Provider value={{ token, setToken, getToken, userName, setUserName, getUserName }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
