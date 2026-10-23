import React, { useEffect, useImperativeHandle, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (error?: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export interface TurnstileRef {
  reset: () => void;
}

interface TurnstileProps {
  onVerify: (token: string) => void;
  onError?: (error?: unknown) => void;
  onExpire?: () => void;
  siteKey?: string;
  className?: string;
}

// Cloudflare official always-pass testing key (used if env variable is not set)
const DEFAULT_TEST_SITE_KEY = "1x00000000000000000000AA";

const Turnstile = React.forwardRef<TurnstileRef, TurnstileProps>(
  (
    {
      onVerify,
      onError,
      onExpire,
      siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || DEFAULT_TEST_SITE_KEY,
      className,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (
          typeof window !== "undefined" &&
          window.turnstile &&
          widgetIdRef.current
        ) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (err) {
            console.error("Turnstile reset error:", err);
          }
        }
      },
    }));

    const renderWidget = () => {
      if (
        typeof window !== "undefined" &&
        window.turnstile &&
        containerRef.current &&
        !widgetIdRef.current
      ) {
        try {
          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": (err) => {
              if (onError) onError(err);
            },
            "expired-callback": () => {
              if (onExpire) onExpire();
            },
            theme: "light",
          });
        } catch (err) {
          console.error("Turnstile render error:", err);
        }
      }
    };

    useEffect(() => {
      if (typeof window !== "undefined" && window.turnstile) {
        renderWidget();
      }

      return () => {
        if (
          widgetIdRef.current &&
          typeof window !== "undefined" &&
          window.turnstile
        ) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore cleanup errors
          }
          widgetIdRef.current = null;
        }
      };
    }, [siteKey]);

    return (
      <>
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderWidget}
        />
        <div ref={containerRef} className={className} />
      </>
    );
  }
);

Turnstile.displayName = "Turnstile";

export default Turnstile;
