import React, {
    createContext,
    PropsWithChildren,
    useContext, useState,
} from "react";
import Cookie from "js-cookie";

type hintsContextType = {
    visitedStockMovements: boolean;
    setStockMovementsAsVisited: (val:boolean) => void;
};

const HintsContext = createContext<hintsContextType>({} as hintsContextType);

const useHintsTracking = (): hintsContextType => {
    return useContext(HintsContext);
};

export const HintsTrackingProvider = (props: PropsWithChildren) => {
    const [visitedStockMovements, setVisitedStockMovements] = useState<boolean>(Boolean(Cookie.get('visited-stock-movements')) || false);

    const setStockMovementsAsVisited = (val: boolean) => {
        setVisitedStockMovements(val);
        Cookie.set('visited-stock-movements', val.toString());
    }

    return (
        <HintsContext.Provider value={{
            visitedStockMovements,
            setStockMovementsAsVisited: setStockMovementsAsVisited
        }}>
            {props.children}
        </HintsContext.Provider>
    );
};

export default useHintsTracking;
