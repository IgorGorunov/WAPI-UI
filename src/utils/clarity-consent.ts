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
    // If user granted Performance cookies
    if (performanceAllowed) {
        // 1) Init if needed (safe to call multiple times)
        if (!clarity.hasStarted()) {
            clarity.init("mgi3bjcotp");
        }
        // 2) Send ConsentV2 (we’re not using ads, so deny ad_Storage)
        if (typeof window !== "undefined" && (window as any).clarity) {
            (window as any).clarity("consentv2", {
                ad_Storage: "denied",
                analytics_Storage: "granted",
            });
        }
        return;
    }

    // If user denied Performance cookies:
    // Tell Clarity to erase cookies and remain in no-consent mode
    if (typeof window !== "undefined" && (window as any).clarity) {
        (window as any).clarity("consent", false); // clears _clck/_clsk/CLID & ends session
    }
    // Optional: also remove script tag if you inject it elsewhere
    const tag = document.getElementById("clarity-script");
    if (tag?.parentNode) tag.parentNode.removeChild(tag);
}