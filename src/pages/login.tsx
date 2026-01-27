import Head from "next/head";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LoginPageComponent from "@/screens/LoginPage/";

export default function Login() {
  return (
    <>
      <SEO
        title="Login"
        description="Access your user cabinet. Manage orders, track shipments, view invoices, and control your e-commerce logistics operations."
      />
      <StructuredData
        type="WebPage"
        name="Login - User Cabinet"
        description="Access your user cabinet. Manage orders, track shipments, view invoices, and control your e-commerce logistics operations."
        path="/login"
      />
      {/* Minimal critical CSS */}
      <Head>
        <style dangerouslySetInnerHTML={{
          __html: `
            .login-page__container {
              position: relative;
              width: 100%;
              padding-top: 30px;
            }
            .login-page__text-wrapper {
              text-align: center;
            }
            .login-page__text-wrapper h1 {
              margin: 0 0 10px;
              font-size: 32px;
              font-weight: 600;
            }
            .login-page__text-wrapper h2 {
              margin: 0 0 30px;
              font-size: 20px;
              font-weight: 400;
              color: #6B7280;
            }
          `
        }} />
      </Head>
      <LoginPageComponent />
    </>
  );
}
