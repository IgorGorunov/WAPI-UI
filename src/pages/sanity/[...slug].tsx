// // src/pages/sanity/[...slug].tsx
// 'use client'
//
// import { NextStudio } from 'next-sanity/studio';
// import config from "../../../sanity.config";
// import AuthChecker from "@/components/AuthChecker";
// import {useEffect, useState} from "react";
//
// export default function AdminPage() {
//     const [isClient, setIsClient] = useState(false);
//     useEffect(() => {
//         setIsClient(true);
//         console.log('is client')
//     }, []);
//     return (
//         <AuthChecker isUser={true}>
//             {isClient && <NextStudio config={config} />}
//         </AuthChecker>
//     )
//
// }

import dynamic from 'next/dynamic';
import AuthChecker from '@/components/AuthChecker';

const Studio = dynamic(
    () => import('next-sanity/studio').then((mod) => () => <mod.NextStudio config={require('../../../sanity.config').default} />),
    { ssr: false }
);

export default function AdminPage() {
    return (
        // <AuthChecker isUser={true}>
            <Studio />
        // </AuthChecker>
    );
}