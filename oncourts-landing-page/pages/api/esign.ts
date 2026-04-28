import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../lib/config";

/**
 * POST /api/esign
 *
 * Proxies the eSign request to the backend openapi esign endpoint.
 * Body is forwarded as-is; the backend URL is constructed from
 * tenantId supplied in the request body.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Only POST is supported." });
  }

  const { tenantId, fileStoreId } =
    req.body?.ESignParameter ?? {};

  if (!tenantId || !fileStoreId) {
    console.error("Missing tenantId or fileStoreId in request body");
    return res
      .status(400)
      .json({ error: "tenantId and fileStoreId are required." });
  }

  const backendUrl = API_ENDPOINTS.E_SIGN.ESIGN;

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Backend API error: ${response.status}`,
        message: await response.text(),
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in eSign API route:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
}
