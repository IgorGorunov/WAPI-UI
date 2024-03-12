import {api} from "@/services/api";

const getDasboardData = async (
  //token: string,
  data: {
    startDate: string;
    endDate: string;
    token: string;
  }
) => {
  try {
    const response: any = await api.post(
      `/GetDashboardData`,
      data
    );

    return response;
  } catch (err) {
    console.error(err);
    return err;
  }
};



export { getDasboardData };
