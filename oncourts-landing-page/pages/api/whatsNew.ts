// pages/api/whats-new.ts
import { API_ENDPOINTS } from '../../lib/config';

export default async function handler(req, res) {
  const tenantId = req.query.tenantId;
  try {
    const response = await fetch(
      API_ENDPOINTS.MDMS.SEARCH(tenantId as string),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          MdmsCriteria: {
            tenantId: tenantId as string,
            moduleDetails: [
              {
                moduleName: "LandingPage",
                masterDetails: [{ name: "LatestAndComingSoon" }],
              },
            ],
          },
          RequestInfo: {
            apiId: "Rainmaker",
            msgId: `${Date.now()}|en_IN`,
            plainAccessRequest: {},
          },
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in proxy:", err);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}