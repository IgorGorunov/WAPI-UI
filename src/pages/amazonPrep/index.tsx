import React from "react";
import Head from "next/head";
import Cookie from "js-cookie";
import useAuth from "@/context/authContext";
import AmazonPrepPage from "@/screens/AmazonPrepPage";
import {verifyToken} from "@/services/auth";
import {Routes} from "@/types/routes";
import {ApiResponseType} from "@/types/api";
import {getAmazonPrepParameters} from "@/services/amazonePrep";
import {AmazonPrepOrderParamsType} from "@/types/amazonPrep";

export default function Orders() {
    const { token, setToken } = useAuth();
    const savedToken = Cookie.get('token');

    if (!token && savedToken) setToken(savedToken);



    return (
        <AmazonPrepPage />
    );
}