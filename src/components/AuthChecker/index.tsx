import React, {ReactNode, useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Routes} from "@/types/routes";
import useAuth from "@/context/authContext";
import {NOTIFICATION_OBJECT_TYPES} from "@/types/notifications";
import {capitalizeFirstLetter} from "@/utils/textMessage";

type AuthCheckerPropsType = {
    isUser?: boolean;
    pageName?: string;
    children: ReactNode;
}

const AuthChecker: React.FC<AuthCheckerPropsType> = ({ isUser=true, pageName='', children }) => {
    const Router = useRouter();
    const { token, isAuthorizedUser, isAuthorizedLead, logout, isNavItemAccessible } = useAuth() // Access authentication state
    const [canShow, setCanShow] = useState(false);

    useEffect(() => {
        const checkUser = async() => {
            if (Router.isReady) {
                if (!(isUser && isAuthorizedUser() || !isUser && isAuthorizedLead())) {
                    setCanShow(false);
                    logout();
                    //Router.push(Routes.Login);
                    Router.push({pathname: Routes.Login, query: Router.query || {}});
                } else if (pageName && !isNavItemAccessible(pageName)) {
                    Router.replace(Routes.Dashboard);
                } else {

                    const { type, uuid } = Router.query;

                    if (type && uuid) {
                        const correctType= Array.isArray(type) ? type[0] : type
                        await Router.push({
                            pathname: NOTIFICATION_OBJECT_TYPES[capitalizeFirstLetter(correctType)],
                            query: {uuid: Array.isArray(uuid) ? uuid[0] : uuid}
                        })
                    } else {
                        setCanShow(true);
                    }
                }
            }
        }
        checkUser();
    }, [token, Router.isReady]);

    return (
        <>
            {token && canShow ? children : null}
        </>
    );
};

export default AuthChecker;