import {api} from "@/services/api";

const getDasboardData = async (
  data: {
    startDate: string;
    endDate: string;
    token: string;
    ui?: string;
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
