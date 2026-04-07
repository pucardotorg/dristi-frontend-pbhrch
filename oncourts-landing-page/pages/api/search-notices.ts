import { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { searchText, limit, offset, tenantId } = req.body;

  try {
    const url = API_ENDPOINTS.NOTICES.SEARCH_NOTICES;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        searchText,
        limit,
        offset,
        tenantId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error searching notices: ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in search-notices API:", error);
    return res
      .status(500)
      .json({ error: (error as Error).message || "Internal Server Error" });
  }
}
