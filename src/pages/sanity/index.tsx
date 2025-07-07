'use client'

import { NextStudio } from 'next-sanity/studio';
import config from "../../../sanity.config";
import AuthChecker from "@/components/AuthChecker";
import {useEffect, useState} from "react";

export default function AdminPage() {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);

    return  (
        <AuthChecker isUser={true}>
            {isClient && <NextStudio config={config} />}
        </AuthChecker>
    );
}