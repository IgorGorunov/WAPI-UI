import { api } from "@/services/api";
import { type ApiResponseType } from "@/types/api";
import { type DashboardDataType } from "@/types/dashboard";

export type DashboardRequestParams = {
    startDate?: string;
    endDate?: string;
    alias?: string;
    token?: string;
    ui?: string;
}

const getDashboardData = async (
  data: DashboardRequestParams
): Promise<ApiResponseType<DashboardDataType[]>> => {
    return api.post<DashboardDataType[]>(`/GetDashboardData`, data);

  // try {
  //   // const response = await api.post(
  //   //   `/GetDashboardData`,
  //   //   data
  //   // );
  //
  //     ret
  //
  //
  //   // return response;
  // } catch (err) {
  //   console.error(err);
  //   return err;
  // }
};



export { getDashboardData };
