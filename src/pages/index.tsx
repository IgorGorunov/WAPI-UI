import React from "react";
import Head from "next/head";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";

// import { getDasboardData } from "@/services/dashboard";
// import {
//   DashboardPeriodType,
//   PeriodType,
//   PeriodTypes,
// } from "@/types/dashboard";
import DashboardPage from "@/screens/DashboardPage";


export default function Home() {
  const { token, setToken } = useAuth();
  const savedToken = Cookie.get('token');

  if (!token && savedToken) setToken(savedToken);
  // const router = useRouter();

  console.log('login page: ', token, savedToken);
  // const [pageData, setPageData] = useState<any>(null);

  // const initData = {
  //   startDate: "2023-09-15",
  //   endDate: "2023-09-15",
  //   periodType: PeriodTypes.DAY,
  //   token: token || "",
  // };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const res = await getDasboardData(initData);
  //     setPageData(res?.data);
  //     return res;
  //   };

  //   const response = fetchData();
  // }, []);

  // if (!token && !savedToken) {
  //   router.push('login');
  // }

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" content="dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {<DashboardPage />}
    </>
  );
}
