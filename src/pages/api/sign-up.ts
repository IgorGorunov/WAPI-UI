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

// Single-use token tracker: burns tokens immediately so they cannot be replayed in curl/terminal
const usedTokens = new Map<string, number>();
const TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes

const isTokenReused = (token: string): boolean => {
  const now = Date.now();
  // Periodic cleanup if map grows
  if (usedTokens.size > 2000) {
    usedTokens.forEach((timestamp, key) => {
      if (now - timestamp > TOKEN_TTL_MS) {
        usedTokens.delete(key);
      }
    });
  }

  const timestamp = usedTokens.get(token);
  if (timestamp && now - timestamp < TOKEN_TTL_MS) {
    return true; // Already used!
  }

  usedTokens.set(token, now);
  return false;
};

// IP Rate limiting: max 5 requests per 10 minutes per IP
const ipRequests = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_IP = 5;

const isRateLimited = (ip: string): boolean => {
  if (!ip) return false;
  const now = Date.now();
  const record = ipRequests.get(ip);

  if (!record || now > record.resetTime) {
    ipRequests.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_REQUESTS_PER_IP) {
    return true;
  }

  record.count += 1;
  return false;
};

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

    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "";

    // 3. Rate limiting per IP
    if (ip && isRateLimited(ip)) {
      console.warn(`=== [SIGN-UP] Rate limit exceeded for IP: ${ip} ===`);
      return res.status(429).json({
        errorMessage: ["Too many sign-up attempts. Please try again in a few minutes."],
      });
    }

    // 4. Cloudflare Turnstile Verification
    const turnstileToken = body.turnstileToken;
    if (!turnstileToken) {
      return res.status(400).json({
        errorMessage: ["Security check required. Please verify you are human."],
      });
    }

    // 5. Single-use token invalidation: burn token immediately to prevent replay attacks
    if (isTokenReused(turnstileToken)) {
      console.warn("=== [SIGN-UP] Replay attack detected: token already used ===");
      return res.status(403).json({
        errorMessage: ["Security verification expired. Please try submitting again."],
      });
    }

    const secret = process.env.TURNSTILE_SECRET_KEY || DEFAULT_TEST_SECRET_KEY;

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
        errorMessage: ["Security check failed. Please try submitting again."],
      });
    }

    // 6. Clean up security fields before passing payload to backend
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
