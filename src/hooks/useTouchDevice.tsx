import {useEffect, useState} from "react";

export const useIsTouchDevice = () => {
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    useEffect(() => {
        const checkIfTouchDevice = () => {
            setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };

        checkIfTouchDevice();
        window.addEventListener('resize', checkIfTouchDevice);

        return () => {
            window.removeEventListener('resize', checkIfTouchDevice);
        };
    }, []);

    return isTouchDevice;
};