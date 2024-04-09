import {api} from "@/services/api";
const signUp = async (
    //token: string,
    data: {
        lead: {
            contact: string;
            phone: string;
            email: string;
        }
    }
) => {
    try {
        const response: any = await api.post(
            `/CreateLead`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};

const confirmEmail = async (
    data: {
        uuid: string;
    }
) => {
    try {
        const response: any = await api.post(
            `/LeadEmailConfirmation`,
            data
        );

        return response;
    } catch (err) {
        console.error(err);
        return err;
    }
};


export { signUp, confirmEmail };
