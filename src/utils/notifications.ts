import {setNotificationStatus} from "@/services/notifications";
import {NOTIFICATION_STATUSES} from "@/types/notifications";

export const markNotificationAsRead = async(token: string, uuid: string) => {
    try {
        await setNotificationStatus({token, uuid, status: NOTIFICATION_STATUSES.READ});
    } catch {
       // console.log('Something went wrong')
    }
}

export const setNotificationStatusFn = async(token: string, uuid: string, status: NOTIFICATION_STATUSES) => {
    try {
        await setNotificationStatus({token, uuid, status: status});
    } catch {
        //console.log('Something went wrong')
    }
}

// setFilterState((prevState: string[]) => {
//     if (!getIsChecked(val, prevState)) {
//         return [...prevState, val]
//     } else {
//         return [...prevState.filter(item => item !== val)];
//     } });