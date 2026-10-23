import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const API_BASE_URL =
  process.env.API_ENDPOINT ||
  process.env.NEXT_PUBLIC_API_ENDPOINT ||
  "https://api.wapi.com/WAPI/hs/v1/UI";
const BACKEND_URL = `${API_BASE_URL}/CreateLead`;

const CLOUDFLARE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
// Cloudflare official testing secret key that always passes if TURNSTILE_SECRET_KEY is not yet set
const DEFAULT_TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ errorMessage: ["Method Not Allowed"] });
  }

  // 1. Origin header check (blocks basic foreign cross-origin scripts)
  const origin = (req.headers["origin"] || req.headers["referer"] || "") as string;
  const isAllowedOrigin =
    !origin ||
    origin.includes("wapi.com") ||
    origin.includes("vercel.app") ||
    origin.includes("localhost") ||
    origin.includes("127.0.0.1");

  if (!isAllowedOrigin) {
    return res.status(403).json({ errorMessage: ["Forbidden: Invalid request origin"] });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    // 2. Honeypot check (catches simple automated bots filling all inputs)
    if (body.website_hp) {
      console.warn("=== [SIGN-UP] Bot detected via honeypot field ===");
      return res.status(400).json({ errorMessage: ["Spam detected"] });
    }

    // 3. Cloudflare Turnstile Verification (blocks curl / terminal scripts completely)
    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return res.status(400).json({
        errorMessage: ["Security check required. Please verify you are human."],
      });
    }

    const secret = process.env.TURNSTILE_SECRET_KEY || DEFAULT_TEST_SECRET_KEY;
    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";

    const verifyParams = new URLSearchParams();
    verifyParams.append("secret", secret);
    verifyParams.append("response", turnstileToken);
    if (ip) {
      verifyParams.append("remoteip", ip);
    }

    const verifyResponse = await axios.post(
      CLOUDFLARE_VERIFY_URL,
      verifyParams.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        timeout: 10000,
      }
    );

    if (!verifyResponse.data?.success) {
      console.error("=== [SIGN-UP] Turnstile Verification Failed ===", verifyResponse.data);
      return res.status(403).json({
        errorMessage: ["Security check failed. Please refresh the page and try again."],
      });
    }

    // 4. Clean up security fields before passing payload to backend
    const { turnstileToken: _token, website_hp: _hp, ...payloadWithoutSecurityFields } = body;

    const token =
      process.env.SIGNUP_TOKEN_UI ||
      process.env.SIGNUP_TOKEN ||
      process.env.NEXT_PUBLIC_PASSWORD_RECOVERY_TOKEN_UI ||
      "";

    const payload = {
      ...payloadWithoutSecurityFields,
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

      const backendData = error.response.data;
      if (typeof backendData === "string") {
        return res.status(error.response.status).json({ errorMessage: [backendData] });
      }
      if (backendData && typeof backendData === "object" && !backendData.errorMessage) {
        const msg = backendData.message || backendData.error || "Unable to complete sign-up request.";
        return res.status(error.response.status).json({
          errorMessage: Array.isArray(msg) ? msg : [msg],
        });
      }

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
