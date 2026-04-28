import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

/**
 * GET /api/case/search?caseSearchText=...&limit=...&offset=...
 *
 * Proxies case search by text to the backend openapi endpoint.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Only GET is supported." });
  }

  const { searchText, limit, offset, tenantId, courtId } = req.query;

  const params = new URLSearchParams();
  if (searchText) params.set("searchText", String(searchText));
  if (limit) params.set("limit", String(limit));
  if (offset) params.set("offset", String(offset));
  if (courtId) params.set("courtId", String(courtId));

  const url = `${API_ENDPOINTS.OPENAPI.CASE_SEARCH(tenantId as string)}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
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
    console.error("Error in case search API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error)?.message,
    });
  }
}
