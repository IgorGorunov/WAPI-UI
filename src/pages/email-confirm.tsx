import SEO from "@/components/SEO";
import ConfirmEmailPage from "@/screens/ConfirmEmailPage";

export default function ConfirmEmail() {
    return (
        <>
            <SEO 
                title="Confirm Email"
                description="Verify your email address to activate your WAPI account and start using our logistics services."
                noindex={true}
            />
            <ConfirmEmailPage />
        </>
    );
}