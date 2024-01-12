import {AuthApiResponseType} from "@/types/api";
import {setCurrentDate} from "@/context/authContext";

export const checkCurrentDate = (currentDate: Date, newDate: string) => {
    if (newDate && new Date(newDate).getDate() !== currentDate.getDate()) {
        setCurrentDate(newDate);
    }
}

export const verifyUser = (apiResponse: AuthApiResponseType, currentDate: Date) => {
    if (apiResponse && apiResponse.status === 200) {
        checkCurrentDate(currentDate, apiResponse?.data?.currentDate);
        return true;
    }

    return false;
}



