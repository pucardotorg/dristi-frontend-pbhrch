import { API_ENDPOINTS } from "../../lib/config";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { tenantId, fileStoreId } = req.query;
    const authToken = req.headers["auth-token"];

    if (!fileStoreId) {
        return res.status(400).json({ error: "Missing fileStoreId" });
    }

    try {
        if (!tenantId) {
            return res.status(400).json({ error: "Missing tenantId" });
        }
        const url = `${API_ENDPOINTS.FILESTORE.FETCH}?tenantId=${tenantId}&fileStoreId=${fileStoreId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "*/*",
                ...(authToken ? { "auth-token": Array.isArray(authToken) ? authToken[0] : authToken as string } : {}),
            },
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch file from filestore" });
        }

        const fileBuffer = await response.arrayBuffer();
        const contentType = response.headers.get("content-type") || "application/pdf";

        res.setHeader("Content-Type", contentType);
        res.setHeader("Cache-Control", "no-store, max-age=0");

        return res.status(200).send(Buffer.from(fileBuffer));
    } catch (error) {
        console.error("[getFileByFileStoreId] Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
