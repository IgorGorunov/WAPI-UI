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

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" content="dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="16x48"/>
      </Head>
      {<DashboardPage />}
    </>
  );
}
