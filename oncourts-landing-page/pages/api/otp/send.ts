import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/otp/send
 *
 * Proxies the OTP send request to the backend user-otp service.
 * Expects body: { otp: { mobileNumber, tenantId, userType, type } }
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

  const tenantId = (req.query?.tenantId as string) || req.body?.otp?.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: "Missing tenantId" });
  }
  const url = `${API_ENDPOINTS.OTP.SEND}?tenantId=${tenantId}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
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
    console.error("Error in OTP send API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
