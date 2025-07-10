import type {AppContext, AppProps} from "next/app";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.scss";
import {NotificationsProvider} from "@/context/notificationContext";
import {TourGuideProvider} from "@/context/tourGuideContext";
import { clarity } from 'react-microsoft-clarity';
import {useEffect, useState} from "react";
import {HintsTrackingProvider} from "@/context/hintsContext";
import {getTenantData, TENANT_TYPE, TenantDataType, TENANTS, tenants} from '@/lib/tenants';
import { TenantContext } from "@/context/tenantContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  weight: ["400", "700", "900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});

export function App({ Component, pageProps, tenantHost, host }: AppProps & {tenantHost?: string, host?: string}) {
  const [tenant, setTenant] = useState<null|TENANT_TYPE>(null);
  const [tenantData, setTenantData] = useState<TenantDataType | null>(null);

  // console.log("tenant", host, tenantHost);

  useEffect(() => {
    if (!clarity.hasStarted()) {
      clarity.init('mgi3bjcotp');
    }
  }, []);

  useEffect(() => {
    if (tenantHost) {
      // Cookies.set('tenant', tenantHost, { path: '/' });
      setTenant(TENANTS[tenantHost] as TENANT_TYPE );
      setTenantData(getTenantData(TENANTS[tenantHost] as TENANT_TYPE ) || null);
      console.log("Host", host, tenantHost, '---', TENANTS[tenantHost], '--', getTenantData(TENANTS[tenantHost]));
    }
    // console.log('tenant 11:  ', tenantHost)
  }, [tenantHost]);


  return (
    <>
      <style jsx global>{`
        :root {
          --roboto-font: ${roboto.style.fontFamily};
          --inter-font: ${inter.style.fontFamily};
        }
      `}</style>

      {
        <TenantContext.Provider value={{tenant, setTenant, getTenantData, tenantData}}>
          <NotificationsProvider>
            <AuthProvider>
              <TourGuideProvider>
                <HintsTrackingProvider>
                  <Component {...pageProps} />
                </HintsTrackingProvider>
              </TourGuideProvider>
            </AuthProvider>
          </NotificationsProvider>
        </TenantContext.Provider>
      }
    </>
  );
}

App.getInitialProps = async (appContext: AppContext) => {
  const { ctx } = appContext;

  let host: string;

  if (typeof window === 'undefined') {
    // SSR: Extract from headers
    const rawHost = ctx.req?.headers['x-forwarded-host'] || ctx.req?.headers.host || 'localhostq:3000';
    host = Array.isArray(rawHost) ? rawHost[0] : rawHost;
  } else {
    // CSR: Use browser location
    host = window.location.hostname;
  }

  // Normalize: remove "www." and port
  host = host.replace(/^www\./, '').replace(/:\d+$/, '');

  // Resolve tenant based on host
  const tenantHost = tenants[host] || tenants['ui.wapi.com'];

  const componentProps =
      typeof appContext.Component.getInitialProps === 'function'
          ? await appContext.Component.getInitialProps(ctx)
          : {};

  return {
    ...componentProps,
    tenantHost,
    host,
  };
};

export default App;
