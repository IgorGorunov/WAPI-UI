import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import ForgottenPasswordPage from "@/screens/ResetPassword/ForgottenPasswordPage";

export default function ForgotPassword() {
    return (
        <>
            <SEO
                title="Password recovery"
                description=""
            />
            <StructuredData
                type="WebPage"
                name="Password Recovery"
                description=""
                path="/privacy-policy"
            />
            <ForgottenPasswordPage />
        </>
    );
}