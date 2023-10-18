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

// function setToken(userToken: string) {
//   // sessionStorage.setItem("token", JSON.stringify(userToken));
// }

// function getToken() {
//   // const tokenString = sessionStorage.getItem("token");
//   // const userToken = JSON.parse(tokenString || "");
//   // return userToken?.token;
//   return "";
// }

export { authenticate };
