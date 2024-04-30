import {loginApi} from "@/services/api";


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

const authenticateWithOneTimeToken = async (data: {
  oneTimeToken: string,
}) => {
  try {
    const response: any = await loginApi.post(
        `/Authorize`,
        data
    );
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const getUserList = async (data: {
  token: string,
}) => {
  try {
    const response: any = await loginApi.post(
        `/GetUIList`,
        data
    );
    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { authenticate, authenticateWithOneTimeToken, getUserList };
