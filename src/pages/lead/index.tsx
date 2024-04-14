
import LeadPage from "@/screens/LeadPage";
import AuthChecker from "@/components/AuthChecker";

export default function Lead() {
    return (
        <AuthChecker isUser={false}>
            <LeadPage />
        </AuthChecker>
    );
}