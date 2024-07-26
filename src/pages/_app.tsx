import type { AppProps } from "next/app";
import { Roboto } from "next/font/google";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/context/authContext";
import "@/styles/globals.scss";
import {NotificationsProvider} from "@/context/notificationContext";
import {TourGuideProvider} from "@/context/tourGuideContext";
import { clarity } from 'react-microsoft-clarity';
import {useEffect} from "react";
import {useRouter} from "next/router";
import {NextIntlClientProvider} from 'next-intl';

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

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  useEffect(() => {
    if (!clarity.hasStarted()) {
      clarity.init('mgi3bjcotp');
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        :root {
          --roboto-font: ${roboto.style.fontFamily};
          --inter-font: ${inter.style.fontFamily};
        }
      `}</style>

      {
        <NextIntlClientProvider
            locale={router.locale}
            messages={pageProps.messages}
            timeZone="Europe/Vienna"
        >
          <NotificationsProvider>
            <AuthProvider>
              <TourGuideProvider>
                <Component {...pageProps} />
              </TourGuideProvider>
            </AuthProvider>
          </NotificationsProvider>
        </NextIntlClientProvider>
      }
    </>
  );
}
