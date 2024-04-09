import React, {ReactNode, useEffect, useState} from "react";
import Router from "next/router";
import {Routes} from "@/types/routes";
import useAuth from "@/context/authContext";

type AuthCheckerPropsType = {
    isUser?: boolean;
    children: ReactNode;
}

const AuthChecker: React.FC<AuthCheckerPropsType> = ({ isUser=true, children }) => {
    const { isAuthorizedUser, isAuthorizedLead, logout } = useAuth() // Access authentication state
    const [canShow, setCanShow] = useState(false)

    useEffect(() => {
        if (!(isUser && isAuthorizedUser() || !isUser && isAuthorizedLead() )) {
            logout();
            Router.push(Routes.Login);
        } else setCanShow(true);
    }, []);

    return (
        <>
            {canShow ? children : null}
        </>
    );
};

export default AuthChecker;