import Cookies from "js-cookie";
import { clarity } from "react-microsoft-clarity";
import {CONSENT_COOKIE} from "@/components/CookieConsent";

// Your existing consent cookie shape: { functional: boolean, performance: boolean }
export function getPerformanceConsent(): boolean {
    try {
        const raw = Cookies.get(CONSENT_COOKIE);
        if (!raw) return false;
        const parsed = JSON.parse(raw);
        return !!parsed.performance;
    } catch {
        return false;
    }
}

/** Apply current consent to Clarity (grant or revoke) */
export function applyClarityConsent(performanceAllowed: boolean) {
    if (performanceAllowed) {
        // Init only after consent
        if (!clarity.hasStarted()) {
            clarity.init('mgi3bjcotp');
        }
        // Tell Clarity consent is granted for analytics; ads denied
        if (typeof window !== 'undefined' && (window as any).clarity) {
            (window as any).clarity('consentv2', {
                ad_Storage: 'denied',
                analytics_Storage: 'granted',
            });
        }
        return;
    }

    // Consent denied: tell Clarity to erase cookies and stay in no-consent mode
    if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('consent', false); // clears _clck/_clsk and ends session
    }
    removeClarityCookiesForHost();

    // If a script tag was injected by you somewhere, you may also remove it
    const tag = document.getElementById('clarity-script');
    tag?.parentNode?.removeChild(tag);
}

// utils/cookies.ts
export function removeClarityCookiesForHost() {
    try {
        const host = location.hostname;           // e.g. "ui.wapi.com"
        const apex = host.replace(/^[^.]+(\.|$)/, '.'); // ".wapi.com" (handles multi-tenant subdomains)

        // Try both with and without explicit domain (covers both cases)
        const optsList = [
            { path: '/', domain: apex },
            { path: '/' },
        ];

        ['_clck', '_clsk'].forEach((name) => {
            optsList.forEach((opts) => {
                // @ts-ignore
                Cookie.remove(name, opts);
            });
        });
    } catch {/* noop */}
}