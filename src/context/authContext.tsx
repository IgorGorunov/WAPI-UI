import React, {
  createContext,
  PropsWithChildren,
  useContext,
} from "react";
import Cookie from "js-cookie";

type authContextType = {
  token: string | null;
  setToken: (token: string) => void;
  getToken: () => string | null;
};

const AuthContext = createContext<authContextType>({} as authContextType);

const useAuth = (): authContextType => {
  return useContext(AuthContext);
};

export const AuthProvider = (props: PropsWithChildren) => {
  const token = Cookie.get('token');
  const setToken = (token:string) => Cookie.set('token', token);
  const getToken = () => Cookie.get('token');

  return (
    <AuthContext.Provider value={{ token, setToken, getToken }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
