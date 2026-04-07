import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/otp/create
 *
 * Proxies the /user/citizen/_create request to the backend user service.
 * Expects body: { username, otpReference, tenantId }
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

  const { username, otpReference, tenantId } = req.body;

  try {
    const timestamp = Date.now();
    const endpoint = `${API_ENDPOINTS.OTP.CREATE}?tenantId=${tenantId}&_=${timestamp}`;

    const requestBody = {
      User: {
        name: "digit-user", // default required by payload
        username: username,
        otpReference: otpReference,
        tenantId: tenantId,
      },
      RequestInfo: {
        apiId: "Dristi",
        msgId: `${timestamp}|en_IN`,
        plainAccessRequest: {},
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
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
    console.error("Error in OTP create API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
