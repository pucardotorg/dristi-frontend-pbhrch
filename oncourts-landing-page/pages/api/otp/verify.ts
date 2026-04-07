import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/otp/verify
 *
 * Proxies the OAuth token request to the backend user service.
 * Expects body: { username, password (OTP), tenantId, userType, scope, grant_type }
 * Sends as application/x-www-form-urlencoded with Basic auth header.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Only POST is supported." });
  }

  const { username, password, tenantId, userType, scope, grant_type } =
    req.body;

  const formBody = new URLSearchParams({
    username: username || "",
    password: password || "",
    tenantId: tenantId,
    userType: userType || "citizen",
    scope: scope || "read",
    grant_type: grant_type || "password",
  });

  try {
    const response = await fetch(API_ENDPOINTS.OTP.VERIFY, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic ZWdvdi11c2VyLWNsaWVudDo=",
        Accept: "application/json",
      },
      body: formBody.toString(),
    });

    if (!response?.ok) {
      return res.status(response?.status).json({
        error: `API error: ${response?.status}`,
        message: await response?.text(),
      });
    }

    const data = await response?.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in OTP verify API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
