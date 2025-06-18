import React from "react";
import DashboardPage from "@/screens/DashboardPage";
import AuthChecker from "@/components/AuthChecker";

export default function Home() {

  return (
    <>
      <AuthChecker isUser={true}>
        <DashboardPage />
      </AuthChecker>
    </>
  );
}
