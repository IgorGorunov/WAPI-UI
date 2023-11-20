import axios from "axios";

const API_ENDPOINT = "https://api.wapi.com/WAPI/hs/v1/UI";

const getDasboardData = async (
  //token: string,
  data: {
    startDate: string;
    endDate: string;
    token: string;
  }
) => {
  try {
    const response: any = await axios.post(
      `${API_ENDPOINT}/GetDashboardData`,
      data
      //   {
      //     headers: {
      //       Authorization: token,
      //     },
      //   }
    );

    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};

export { getDasboardData };
