import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../lib/config";

/**
 * POST /api/epayments
 *
 * Proxies the eTreasury callback (RETURN_PARAMS / RETURN_HEADER)
 * to the backend /epayments endpoint.
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
    const response = await fetch(API_ENDPOINTS.PAYMENT.EPAYMENTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const contentType = response.headers.get("content-type") || "";

    if (!response?.ok) {
      const errorBody = await response?.text();
      if (contentType.includes("text/html")) {
        res.setHeader("Content-Type", "text/html");
        return res.status(response?.status).send(errorBody);
      }
      return res.status(response?.status).json({
        error: `API error: ${response?.status}`,
        message: errorBody,
      });
    }

    // Forward HTML responses as-is (e.g. payment confirmation pages)
    if (contentType.includes("text/html")) {
      const html = await response.text();
      res.setHeader("Content-Type", "text/html");
      return res.status(200).send(html);
    }

    const data = await response?.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in epayments API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
