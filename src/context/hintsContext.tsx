import React, {
    createContext,
    PropsWithChildren,
    useContext, useState,
} from "react";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";

type hintsContextType = {
    visitedStockMovements: boolean;
    setStockMovementsAsVisited: (val:boolean) => void;
    addInboundsNumber: () => void;
    cancelHintsNumber: number;
    addCancelHintsNumber: ()=>void;
};

const HintsContext = createContext<hintsContextType>({} as hintsContextType);

const useHintsTracking = (): hintsContextType => {
    return useContext(HintsContext);
};

export const HintsTrackingProvider = (props: PropsWithChildren) => {
    const {cookieConsent} = useAuth();

    const [visitedStockMovements, setVisitedStockMovements] = useState<boolean>(Boolean(Cookie.get('visited-stock-movements')) || false);
    // const [visitedInboundsNumber, setVisitedInboundsNumber] = useState<number>(Number(Cookie.get('visited-inbounds-number')) || 0);
    const [cancelHintsNumber, setCancelHintsNumber] = useState(Number(Cookie.get('inbound-hints-cancel-number')) || 0);

    const setStockMovementsAsVisited = (val: boolean) => {
        setVisitedStockMovements(val);
        if (cookieConsent?.functional) {
            Cookie.set('visited-stock-movements', val.toString(), { expires: 730 });
        }

    }
    const addInboundsNumber = () => {
        // setVisitedInboundsNumber(prevState=>prevState+1);
        // Cookie.set('visited-inbounds-number', (visitedInboundsNumber+1).toString(),{ expires: 730 });
    }

    const addCancelHintsNumber = () => {
        setCancelHintsNumber(prevState=>prevState+1);
        if (cookieConsent?.functional) {
            Cookie.set('inbound-hints-cancel-number', (cancelHintsNumber+1).toString(), { expires: 730 });
        }

    }

    return (
        <HintsContext.Provider value={{
            visitedStockMovements,
            setStockMovementsAsVisited: setStockMovementsAsVisited,
            addInboundsNumber,
            cancelHintsNumber,
            addCancelHintsNumber
        }}>
            {props.children}
        </HintsContext.Provider>
    );
};

export default useHintsTracking;
