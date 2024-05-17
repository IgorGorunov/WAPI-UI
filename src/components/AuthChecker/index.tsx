import React, {ReactNode, useEffect, useState} from "react";
import Router from "next/router";
import {Routes} from "@/types/routes";
import useAuth from "@/context/authContext";

type AuthCheckerPropsType = {
    isUser?: boolean;
    pageName?: string;
    children: ReactNode;
}

const AuthChecker: React.FC<AuthCheckerPropsType> = ({ isUser=true, pageName='', children }) => {
    const { token, isAuthorizedUser, isAuthorizedLead, logout, isNavItemAccessible } = useAuth() // Access authentication state
    const [canShow, setCanShow] = useState(false)

    useEffect(() => {
        if (!(isUser && isAuthorizedUser() || !isUser && isAuthorizedLead() )) {
            setCanShow(false);
            logout();
            Router.push(Routes.Login);
        } else if (pageName && !isNavItemAccessible(pageName)) {
            Router.replace(Routes.Dashboard);
        } else setCanShow(true);
    }, [token]);

    return (
        <>
            {canShow ? children : null}
        </>
    );
};

export default AuthChecker;