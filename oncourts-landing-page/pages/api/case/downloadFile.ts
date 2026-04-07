import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tenantId, orderId } = req.query;

    if (!tenantId || !orderId) {
      return res
        .status(400)
        .json({ error: "Tenant ID and Order ID are required" });
    }

    // Get the actual file URL
    const fileUrl = API_ENDPOINTS.OPENAPI.DOWNLOAD_FILE(
      tenantId as string,
      orderId as string
    );

    // Fetch the file from the API
    const response = await fetch(fileUrl, {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9",
        "auth-token": "26d2f347-05e9-4369-9d99-cc4079063b02",
      },
    });

    if (!response.ok) {
      throw new Error(`File download failed with status: ${response.status}`);
    }

    // Get file content
    const fileBuffer = await response.arrayBuffer();

    // Get content type from response or default to application/octet-stream
    const contentType =
      response.headers.get("content-type") || "application/octet-stream";
    const contentDisposition =
      response.headers.get("content-disposition") ||
      `attachment; filename=file-${orderId}.pdf`;

    // Set appropriate headers for file download
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    // Send the file content
    res.status(200).send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ error: "Failed to download file" });
  }
}
