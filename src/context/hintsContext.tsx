import React, {
    createContext,
    PropsWithChildren,
    useContext, useState,
} from "react";
import Cookie from "js-cookie";

type hintsContextType = {
    visitedStockMovements: boolean;
    setStockMovementsAsVisited: (val:boolean) => void;
    addInboundsNumber: () => void;
};

const HintsContext = createContext<hintsContextType>({} as hintsContextType);

const useHintsTracking = (): hintsContextType => {
    return useContext(HintsContext);
};

export const HintsTrackingProvider = (props: PropsWithChildren) => {
    const [visitedStockMovements, setVisitedStockMovements] = useState<boolean>(Boolean(Cookie.get('visited-stock-movements')) || false);
    const [visitedInboundsNumber, setVisitedInboundsNumber] = useState<number>(Number(Cookie.get('visited-inbounds-number')) || 0);

    const setStockMovementsAsVisited = (val: boolean) => {
        setVisitedStockMovements(val);
        Cookie.set('visited-stock-movements', val.toString());
    }
    const addInboundsNumber = () => {
        setVisitedInboundsNumber(prevState=>prevState+1);
        Cookie.set('visited-inbounds-number', (visitedInboundsNumber+1).toString());
    }

    return (
        <HintsContext.Provider value={{
            visitedStockMovements,
            setStockMovementsAsVisited: setStockMovementsAsVisited,
            addInboundsNumber,
        }}>
            {props.children}
        </HintsContext.Provider>
    );
};

export default useHintsTracking;
