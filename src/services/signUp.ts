import { api } from "@/services/api";
import { type ApiResponseType } from "@/types/api";

const signUp = async (
    //token: string,
    data: {
        lead: {
            contact: string;
            phone: string;
            email: string;
        }
        utm: Record<string, unknown>;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/CreateLead`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/CreateLead`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};

const confirmEmail = async (
    data: {
        uuid: string;
        alias: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/LeadEmailConfirmation`, data);
    // try {
    //     const response: unknown = await api.post(
    //         `/LeadEmailConfirmation`,
    //         data
    //     );
    //
    //     return response;
    // } catch (err) {
    //     console.error(err);
    //     return err;
    // }
};


export { signUp, confirmEmail };
