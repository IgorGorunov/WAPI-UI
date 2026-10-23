import axios from "axios";
import { api } from "@/services/api";
import { type ApiResponseType } from "@/types/api";

const signUp = async (
    data: {
        lead: {
            contact: string;
            phone: string;
            email: string;
            personalData?: boolean;
        };
        utm: Record<string, unknown>;
        turnstileToken?: string;
        website_hp?: string;
    }
): Promise<ApiResponseType<unknown>> => {
    try {
        const response = await axios.post(`/api/sign-up`, data);
        return response as ApiResponseType<unknown>;
    } catch (err) {
        return err as ApiResponseType<unknown>;
    }
};

const confirmEmail = async (
    data: {
        uuid: string;
        alias: string;
    }
): Promise<ApiResponseType<unknown>> => {
    return api.post(`/LeadEmailConfirmation`, data);
};

export { signUp, confirmEmail };
