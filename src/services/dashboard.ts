import axios from "axios";
import { PeriodType } from "@/types/dashboard";

const API_ENDPOINT = "https://first.wapi.com:4443/WAPI/hs/v1/UI";

const getDasboardData = async (
  //token: string,
  data: {
    startDate: string;
    endDate: string;
    periodType: PeriodType;
    diagramType: PeriodType;
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
