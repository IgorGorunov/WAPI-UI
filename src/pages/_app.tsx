import type { AppContext, AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.scss";
import "@/styles/forms.scss";
import "@/styles/tables.scss";
import "@/components/Layout/styles.scss";
import "@/components/Header/styles.scss";

// Centralized component styles to prevent Fast Refresh reloads on navigation
import "@/components/Skeleton/styles.scss";
import "@/components/Navigation/styles.scss";
import "@/components/Navigation/SubmenuBlock/styles.scss";
import "@/components/Navigation/SubmenuSingleItem/styles.scss";
import "@/components/TourGuide/styles.scss";
import "@/components/ProfileDropdown/UserList/styles.scss";
import "@/components/CookieConsent/styles.scss";

// Third-party CSS
import "flag-icons/css/flag-icons.min.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "react-international-phone/style.css";
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import 'react-toastify/dist/ReactToastify.css';
import "react-phone-number-input/style.css";

import "@/components/HeaderNotifications/styles.scss";
import "@/components/HeaderNotifications/NotificationsBlock/styles.scss";

// Dashboard internal components
import "@/screens/DashboardPage/components/Header/styles.scss";
import "@/screens/DashboardPage/components/Diagram/styles.scss";
import "@/screens/DashboardPage/components/Forecast/styles.scss";
import "@/screens/DashboardPage/components/OrderStatuses/styles.scss";
import "@/screens/DashboardPage/components/OrderStatuses/StatusBar/styles.scss";
import "@/screens/DashboardPage/components/OrdersByCountry/styles.scss";
import "@/screens/DashboardPage/components/OrdersByCountry/CountryList/styles.scss";
import "@/screens/DashboardPage/components/OrdersByCountry/CountryBlock/styles.scss";
import "@/screens/DashboardPage/components/PeriodFilter/styles.scss";
import "@/screens/DashboardPage/components/PeriodFilter/Datepicker/styles.scss";

import { NotificationsProvider } from "@/context/notificationContext";
import { TourGuideProvider } from "@/context/tourGuideContext";
// import { clarity } from 'react-microsoft-clarity';
import { applyClarityConsent, getPerformanceConsent } from '@/utils/clarity-consent';
import { useEffect, useState } from "react";
import { HintsTrackingProvider } from "@/context/hintsContext";
import { getTenantData, TENANT_TYPE, TenantDataType, TENANTS, tenants } from '@/lib/tenants';
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

export function App({ Component, pageProps, tenantHost }: AppProps & { tenantHost?: string, host?: string }) {
  const [tenant, setTenant] = useState<null | TENANT_TYPE>(null);
  const [tenantData, setTenantData] = useState<TenantDataType | null>(null);

  console.log("App: Render");
  useEffect(() => { console.log("App: Mount (First Load/Reload)"); }, []);

  // console.log("tenant", host, tenantHost);

  // useEffect(() => {
  //   if (!clarity.hasStarted()) {
  //     clarity.init('mgi3bjcotp');
  //   }
  // }, []);
  // useEffect(() => {
  //   // Create a queueing shim if not present
  //   (window as any).clarity =
  //       (window as any).clarity ||
  //       function () {
  //         ((window as any).clarity.q = (window as any).clarity.q || []).push(arguments);
  //       };
  //
  //   // Start in denied mode
  //   (window as any).clarity("consentv2", {
  //     ad_Storage: "denied",
  //     analytics_Storage: "denied",
  //   });
  // }, []);

  useEffect(() => {
    // On first load, read current consent and apply
    const perfAllowed = getPerformanceConsent();
    applyClarityConsent(perfAllowed);

    // Listen for consent updates coming from your Cookie banner/modal
    const onConsent = (e: Event) => {
      try {
        const detail = (e as CustomEvent<{ performance: boolean }>).detail;
        if (typeof detail?.performance === "boolean") {
          applyClarityConsent(detail.performance);
        }
      } catch { /* noop */ }
    };
    window.addEventListener("clarity-consent", onConsent);
    return () => window.removeEventListener("clarity-consent", onConsent);
  }, []);

  useEffect(() => {
    if (tenantHost) {
      // Cookies.set('tenant', tenantHost, { path: '/' });
      setTenant(TENANTS[tenantHost] as TENANT_TYPE);
      setTenantData(getTenantData(TENANTS[tenantHost] as TENANT_TYPE) || null);
      // console.log("Host", host, tenantHost, '---', TENANTS[tenantHost], '--', getTenantData(TENANTS[tenantHost]));
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
        <TenantContext.Provider value={{ tenant, setTenant, getTenantData, tenantData }}>
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

// Web Vitals monitoring for performance tracking
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_label: metric.id,
        non_interaction: true,
      });
    }

    // You can also send to other analytics services here
    // Example: send to custom analytics endpoint
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   body: JSON.stringify(metric),
    // });
  }
}
