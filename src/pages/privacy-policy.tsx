import Head from "next/head";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import PrivacyPolicyPage from "@/screens/PrivacyPolicyPage";

export default function PrivacyPolicy() {
    return (
        <>
            <SEO
                title="Privacy Policy"
                description="Learn about WAPI's privacy policy, data protection practices, and how we handle your personal information in our logistics platform."
            />
            <StructuredData
                type="WebPage"
                name="Privacy Policy - WAPI"
                description="Learn about WAPI's privacy policy, data protection practices, and how we handle your personal information in our logistics platform."
                path="/privacy-policy"
            />
            <Head>
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .privacy-policy-page {
                            position: relative;
                            width: 100%;
                        }
                        .privacy-policy-page__text-wrapper {
                            padding: 24px;
                        }
                        .privacy-policy-page__text-wrapper .heading {
                            display: inline-block;
                            font-weight: bold;
                            margin-bottom: 16px;
                        }
                        .privacy-policy-page__text-wrapper li {
                            position: relative;
                            display: block;
                            margin-bottom: 16px;
                            padding-left: 24px;
                            font-size: 16px;
                            line-height: 20px;
                            font-weight: normal;
                        }
                    `
                }} />
            </Head>
            <PrivacyPolicyPage />
        </>
    );
}