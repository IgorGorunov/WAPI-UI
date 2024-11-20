import axios from 'axios';

const LOGGING_URL = 'https://api.wapi.com/UILOG/hs/v1/UI/WriteLog'


export type LocationType = {
    latitude: number;
    longitude: number;
};


// Function to get the user's IP address
export async function getUserIP(): Promise<string> {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching IP address:', error);
        throw new Error('Unable to fetch IP address');
    }
}


export function getUserLanguage(): string {
    return navigator.language || navigator.languages[0] || 'en';
}

export function getUserTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

// Function to get the user's geolocation
export function getUserLocation(): Promise<LocationType> {
    return new Promise((resolve) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    });
                },
                (error) => {
                    console.warn('Geolocation error:', error);
                    resolve({
                        latitude: 0,
                        longitude: 0,
                    });
                }
            );
        } else {
            console.warn('Geolocation is not supported by this browser.');
            resolve({
                latitude: 0,
                longitude: 0,
            });
        }
    });
}

// Function to gather user information
// export async function gatherUserInfo(): Promise<UserInfo | null> {
//     try {
//         const ip = await getUserIP();
//         const location = await getUserLocation();
//
//         const userInfo: UserInfo = {
//             ip,
//             userAgent: navigator.userAgent,
//             location,
//         };
//
//         return userInfo;
//     } catch (error) {
//         console.error('Error gathering user info:', error);
//         return null;
//     }
// }

// Function to send user info to the backend
// export async function sendUserInfoToBackend({requestType, requestData}:{requestType: string, requestData:any}): Promise<void> {
//     const userInfo = await gatherUserInfo();
//
//     if (userInfo) {
//         const dataToSend = {
//             userInfo: userInfo,
//             requestType: requestType,
//             requestData: requestData,
//         }
//
//         try {
//             const response = await axios.post(LOGGING_URL, dataToSend, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (response.status === 200) {
//                 console.log('User info sent successfully');
//             } else {
//                 console.error('Failed to send user info:', response.statusText);
//             }
//         } catch (error) {
//             console.error('Error sending data to backend:', error);
//         }
//     }
// }

export type SendUserBrowserInfoType = {
    headers: any;
    body: any;
    action: string;
    clientName: string;
    email: string;
    token: string;
    forbidden: boolean;
}

export async function sendUserBrowserInfo(dataToSend: SendUserBrowserInfoType): Promise<void> {
    try {
        const response = await axios.post(LOGGING_URL, dataToSend, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // const response = await axios.post(LOGGING_URL, {}, {
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        // });

        if (response.status === 200) {
            //console.log('User info sent successfully');
        } else {
            //console.error('Failed to send user info:', response.statusText);
        }
    } catch (error) {
        //console.error('Error sending data to backend:', error);
    }
}

// // Call the function to gather and send user info
// sendUserInfoToBackend();