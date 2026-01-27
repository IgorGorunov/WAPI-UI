import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import GetStartedPage from "@/screens/GetStartedPage";

export default function GetStarted() {
    return (
        <>
            <SEO
                title="Get Started"
                description="Get started with our logistics services. Learn how to set up your account, manage orders, and streamline your e-commerce fulfillment operations."
            />
            <StructuredData
                type="WebPage"
                name="Get Started"
                description="Get started with our logistics services. Learn how to set up your account, manage orders, and streamline your e-commerce fulfillment operations."
                path="/get-started"
            />
            <GetStartedPage />
        </>
    );
}