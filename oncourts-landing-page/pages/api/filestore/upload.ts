import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

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
    const url = `${API_ENDPOINTS.FILESTORE.UPLOAD}`;

    // Pass the raw Node.js request stream natively into the fetch polyfill
    const init: RequestInit & { duplex?: string } = {
      method: "POST",
      headers: {
        "auth-token": Array.isArray(req.headers["auth-token"])
          ? req.headers["auth-token"][0]
          : req.headers["auth-token"] || "",
        "content-type": Array.isArray(req.headers["content-type"])
          ? req.headers["content-type"][0]
          : req.headers["content-type"] || "",
      },
      body: req as unknown as BodyInit,
      duplex: "half",
    };

    const response = await fetch(url, init);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Backend API error: ${response.status}`,
        message: await response.text(),
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in filestore upload proxy:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
}
