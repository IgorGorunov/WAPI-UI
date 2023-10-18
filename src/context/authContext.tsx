import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

type authContextType = {
  token: string | null;
  setToken: (token: string) => void;
};

const AuthContext = createContext<authContextType>({} as authContextType);

const useAuth = (): authContextType => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = (props: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);
  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default useAuth;
