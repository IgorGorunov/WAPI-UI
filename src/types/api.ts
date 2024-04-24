export type ApiResponseType = {
    data?: any;
    status?: number;
    response?: {
        data?: {
            errorMessage: string[];
            data?: any;
        }
        status?: number;
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