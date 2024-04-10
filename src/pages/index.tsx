import React from "react";
import Head from "next/head";
import DashboardPage from "@/screens/DashboardPage";
import AuthChecker from "@/components/AuthChecker";

export default function Home() {

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="dashboard" content="dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" type="image/png" sizes="16x48"/>
      </Head>
        <AuthChecker isUser={true}>
            <DashboardPage />
        </AuthChecker>
    </>
  );
}
