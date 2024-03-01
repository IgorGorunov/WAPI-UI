import {AuthApiResponseType} from "@/types/api";
import {loginApi, verifyTokenApi} from "@/services/api";


const authenticate = async (login: string, password: string) => {
  try {
    const response: any = await loginApi.post(
      `/Authorize`,
      {
        login,
        password,
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const verifyToken = async (token: string) => {
  try {
    const response: AuthApiResponseType = await verifyTokenApi.post(`/TokenIsValid`,
      {
        token
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
}

export { authenticate, verifyToken };
