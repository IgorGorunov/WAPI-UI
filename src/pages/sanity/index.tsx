import { NextStudio } from 'next-sanity/studio';
import config from "../../../sanity.config";
import AuthChecker from "@/components/AuthChecker";

export default function AdminPage() {
    return  (
        <AuthChecker isUser={true}>
            <NextStudio config={config} />
        </AuthChecker>
    );
}