import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import CookiePolicyPage from "@/screens/CookiePolicyPage";

export default function CookiePolicy() {
    return (
        <>
            <SEO
                title="Cookie Policy"
                description="Understand how we use cookies to improve your experience, analytics, and functionality on our logistics management platform."
            />
            <StructuredData
                type="WebPage"
                name="Cookie Policy"
                description="Understand how we use cookies to improve your experience, analytics, and functionality on our logistics management platform."
                path="/cookie-policy"
            />
            <CookiePolicyPage />
        </>
    );
}