import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../lib/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tenantId, fileStoreId, moduleName } = req.body;

    if (!tenantId || !fileStoreId || !moduleName) {
      return res.status(400).json({
        error: "Tenant ID, File Store ID and Module Name are required",
      });
    }

    // Get the actual file URL
    const fileUrl = API_ENDPOINTS.NOTICES.DOWNLOAD_FILE;

    console.log("Calling API with:", { tenantId, fileStoreId, moduleName });

    // Fetch the file from the API
    const response = await fetch(fileUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
      body: JSON.stringify({
        tenantId,
        fileStoreId,
        moduleName,
      }),
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
      `attachment; filename=file-${fileStoreId}.pdf`;

    // Set appropriate headers for file download
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", contentDisposition);

    // Send the file content
    res.status(200).send(Buffer.from(fileBuffer));
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({
      error: "Failed to download file",
      message: (error as Error).message || "An unexpected error occurred",
    });
  }
}
