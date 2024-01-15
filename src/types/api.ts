export type ApiResponseType = {
    data?: any;
    response?: {
        data?: {
            errorMessage: string[];
        }
    }
};

export type AuthApiResponseType = {
    data?: {
        token: string;
        currentDate: string;
        userPresentation: string;
    };
    response?: {
        data?: {
            errorMessage: string[];
        }
    };
    status: number;
}