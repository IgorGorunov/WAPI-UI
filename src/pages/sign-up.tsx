import Head from "next/head";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import SignUpPage from "@/screens/SignUpPage";
import bgLogo from "@/assets/icons/bg-logo.svg";

export default function SignUp() {
    return (
        <>
            <SEO
                title="Sign Up"
                description="Create your account and start managing your e-commerce logistics, order fulfillment, and warehouse operations efficiently."
            />
            <StructuredData
                type="WebPage"
                name="Sign Up - User Cabinet"
                description="Create your account and start managing your e-commerce logistics, order fulfillment, and warehouse operations efficiently."
                path="/sign-up"
            />
            {/* Preload background image with high priority for LCP optimization */}
            <Head>
                <link
                    rel="preload"
                    href={bgLogo.src}
                    as="image"
                    // @ts-ignore - fetchPriority is valid but not in types yet
                    fetchPriority="high"
                />
                <style dangerouslySetInnerHTML={{
                    __html: `
                        .sign-up-page__container {
                            position: relative;
                            width: 100%;
                            padding-top: 30px;
                        }
                        .sign-up-page__text-wrapper {
                            text-align: center;
                        }
                        .sign-up-page__text-wrapper h1 {
                            margin: 0 0 10px;
                            font-size: 32px;
                            font-weight: 600;
                        }
                        .sign-up-page__text-wrapper h3 {
                            margin: 0 0 30px;
                            font-size: 20px;
                            font-weight: 400;
                            color: #6B7280;
                        }
                    `
                }} />
            </Head>
            <SignUpPage />
        </>
    );
}
