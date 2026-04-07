import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/payment/processChallan
 *
 * Proxies eTreasury challan processing to the backend.
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

  try {
    const response = await fetch(API_ENDPOINTS.PAYMENT.PROCESS_CHALLAN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
    console.error("Error in processChallan API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
