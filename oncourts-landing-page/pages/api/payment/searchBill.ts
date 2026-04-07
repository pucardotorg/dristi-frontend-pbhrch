import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * POST /api/payment/searchBill
 *
 * Proxies bill search request to the backend.
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
    const qs = req.url?.split("?")[1] || "";
    const url = `${API_ENDPOINTS.PAYMENT.SEARCH_BILL}?${qs}`;
    const response = await fetch(url, {
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
    console.error("Error in searchBill API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
