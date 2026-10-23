import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_BASE_URL =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "https://api.wapi.com/WAPI/hs/v1/UI";
const BACKEND_URL = `${API_BASE_URL}/CreateLead`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ errorMessage: ["Method Not Allowed"] });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const token =
      process.env.SIGNUP_TOKEN_UI ||
      process.env.SIGNUP_TOKEN ||
      process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_TOKEN_UI ||
      "";

    const payload = {
      ...body,
      token,
    };

    console.log("=== [SIGN-UP] Request to Backend ===");
    console.log("Full Backend Endpoint:", BACKEND_URL);
    console.log("Body:", JSON.stringify(payload, null, 2));

    const backendResponse = await axios.post(BACKEND_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
    });

    console.log("=== [SIGN-UP] Response from Backend ===");
    console.log("Full Backend Endpoint:", BACKEND_URL);
    console.log("Status:", backendResponse.status);
    console.log("Data:", JSON.stringify(backendResponse.data, null, 2));

    return res.status(backendResponse.status).json(backendResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("=== [SIGN-UP] Backend Error Response ===");
      console.error("Full Backend Endpoint:", BACKEND_URL);
      console.error("Status:", error.response.status);
      console.error("Data:", JSON.stringify(error.response.data, null, 2));
      return res.status(error.response.status).json(error.response.data);
    }

    console.error("=== [SIGN-UP] Request Failed ===");
    console.error("Full Backend Endpoint:", BACKEND_URL);
    console.error("Error:", error);
    return res.status(500).json({
      errorMessage: ["Unable to complete sign-up request. Please try again later."],
    });
  }
}
