import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Routes } from "@/types/routes";
import useAuth from "@/context/authContext";
import { NOTIFICATION_OBJECT_TYPES } from "@/types/notifications";
import { capitalizeFirstLetter } from "@/utils/textMessage";
import { getCleanParamsFromQuery } from "@/utils/query";

type AuthCheckerPropsType = {
    isUser?: boolean;
    pageName?: string;
    children: ReactNode;
}

const AuthChecker: React.FC<AuthCheckerPropsType> = ({ isUser = true, pageName = '', children }) => {
    const Router = useRouter();
    const { token, isAuthorizedUser, isAuthorizedLead, logout, isNavItemAccessible } = useAuth();
    const [canShow, setCanShow] = useState(false);

    // Always-fresh refs for context functions — avoids stale closures without adding
    // them as effect deps (which would cause re-runs on every AuthProvider render).
    const isAuthorizedUserRef = useRef(isAuthorizedUser);
    const isAuthorizedLeadRef = useRef(isAuthorizedLead);
    const logoutRef = useRef(logout);
    const isNavItemAccessibleRef = useRef(isNavItemAccessible);
    isAuthorizedUserRef.current = isAuthorizedUser;
    isAuthorizedLeadRef.current = isAuthorizedLead;
    logoutRef.current = logout;
    isNavItemAccessibleRef.current = isNavItemAccessible;

    // Prevents re-triggering the auth check while a navigation is already in flight.
    const isNavigatingRef = useRef(false);

    useEffect(() => {
        const checkUser = async () => {
            if (!Router.isReady || isNavigatingRef.current) {
                console.log('[AuthChecker] skipping: isReady=', Router.isReady, 'isNavigating=', isNavigatingRef.current);
                return;
            }

            const authorized = isUser && isAuthorizedUserRef.current() || !isUser && isAuthorizedLeadRef.current();
            console.log('[AuthChecker] check: token=', token?.substring(0, 10), 'authorized=', authorized, 'isUser=', isUser);

            if (!authorized) {
                console.log('[AuthChecker] NOT authorized → redirecting to login');
                isNavigatingRef.current = true;
                setCanShow(false);
                logoutRef.current();
                await Router.push({ pathname: Routes.Login, query: Router.query || {} });
            } else if (pageName && !isNavItemAccessibleRef.current(pageName)) {
                isNavigatingRef.current = true;
                Router.replace(Routes.Dashboard);
            } else {
                const cleanQuery = getCleanParamsFromQuery(Router.query);
                const type = cleanQuery['type'];
                const uuid = cleanQuery['uuid'];

                if (type && uuid) {
                    isNavigatingRef.current = true;
                    await Router.push({
                        pathname: NOTIFICATION_OBJECT_TYPES[capitalizeFirstLetter(type)],
                        query: { uuid: uuid }
                    });
                } else {
                    setCanShow(true);
                }
            }
        };
        checkUser();
    }, [token, Router.isReady, isUser, pageName, Router]);

    return (
        <>
            {token && canShow ? children : null}
        </>
    );
};

export default AuthChecker;