import axios from "axios";
// import { GetServerSidePropsContext } from "next";
// import {getSession, signOut} from 'next-auth/react'
// import Router from "next/router";
import toast from "react-simple-toasts";

// import { Routes } from "@/types/routes";

const API_URL = "https://api.wapi.com/WAPI/hs/v1/UI";
const api = axios.create({ baseURL: API_URL });

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message = "";

    let errorData = error.response.data;
    if (
      error.request.responseType === "blob" &&
      error.response.data instanceof Blob
    ) {
      const text = await errorData.text();
      try {
        errorData = JSON.parse(text);
      } catch (err) {
        errorData = text;
      }
    }

    if (typeof errorData === "string") {
      message = errorData;
    } else if (typeof errorData.error === "string") {
      message = errorData.error;
    } else {
      message = "Something went wrong!";
    }

    if (message) toast(message, { theme: "failure" });
  }
);

export default api;
