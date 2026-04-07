import { API_ENDPOINTS } from "../../lib/config";

export default async function handler(req, res) {
  const { tenantId, Criteria } = req.body;

  if (!tenantId || !Criteria) {
    return res.status(400).json({
      error: "Missing required parameters: tenantId and Criteria are required",
    });
  }

  try {
    const response = await fetch(API_ENDPOINTS.SCHEDULER.DOWNLOAD, {
      method: "POST",
      headers: {
        Accept: "application/json,text/plain, */*",
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({ tenantId, Criteria }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return res.status(response.status).json({
          error: "Cause list not available for the day.",
        });
      } else {
        return res.status(response.status).json({
          error: "Something went wrong!",
        });
      }
    }

    const pdfBuffer = await response.arrayBuffer();

    res.setHeader("Content-Disposition", "attachment; filename=causelist.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Cache-Control", "no-store, max-age=0");

    return res.status(200).send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Unexpected server error:", error);
    return res.status(500).json({
      error: "Internal Server Error. Please try again later.",
    });
  }
}
