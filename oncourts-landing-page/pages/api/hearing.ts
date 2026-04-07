import { API_ENDPOINTS } from "../../lib/config";

export default async function handler(req, res) {
  try {
    const {
      tenantId,
      fromDate,
      toDate,
      searchText,
      isHearingSerialNumberSorting = false,
    } = req.body;

    const payload = {
      tenantId,
      fromDate,
      toDate,
      searchText,
      isHearingSerialNumberSorting,
    };

    const response = await fetch(API_ENDPOINTS.OPENAPI.HEARING, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type");
    const statusCode = response.status;

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(statusCode).json(data);
    } else {
      const text = await response.text();
      return res.status(statusCode).send(text);
    }
  } catch (err) {
    console.error("Error in proxy:", err as Error);
    return res.status(502).json({
      error: "Failed to fetch data from upstream API",
      message: (err as Error).message,
    });
  }
}
