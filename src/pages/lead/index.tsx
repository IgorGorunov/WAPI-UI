
import LeadPage from "@/screens/LeadPage";
import AuthChecker from "@/components/AuthChecker";
import {GetStaticPropsContext} from "next";

export default function Lead() {
    return (
        // <AuthChecker isUser={false}>
            <LeadPage />
        // </AuthChecker>
    );
}

export async function getStaticProps({locale}: GetStaticPropsContext) {
    return {
        props: {
            messages: (await import(`../../../messages/${locale}.json`)).default
        }
    };
}