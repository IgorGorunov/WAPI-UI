import axios from "axios";
// import api from "./api";

const API_ENDPOINT = "https://first.wapi.com:4443/WAPI/hs/v1/UI";

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
    const response = await axios.post(`${API_ENDPOINT}/TokenIsValid`,
      {
        token
      },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return (response?.status === 200);
  } catch (err) {
    console.error(err);
    return false;
  }
}

export { authenticate, verifyToken };
