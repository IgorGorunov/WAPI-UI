import axios from "axios";
import {AuthApiResponseType} from "@/types/api";

// import api from "./api";

const API_ENDPOINT = 'https://api.wapi.com/WAPI/hs/v1/UI'; //"https://api.wapi.com/WAPI/hs/v1/UI";

const authenticate = async (login: string, password: string) => {
  try {
    const response: any = await axios.post(
      `${API_ENDPOINT}/Authorize`,
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
    const response: AuthApiResponseType = await axios.post(`${API_ENDPOINT}/TokenIsValid`,
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
