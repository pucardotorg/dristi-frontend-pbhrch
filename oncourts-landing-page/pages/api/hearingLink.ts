import { API_ENDPOINTS } from "../../lib/config";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  const { tenantId } = req.query;

  try {
    const payload = {
      MdmsCriteria: {
        tenantId: tenantId as string,
        moduleDetails: [
          {
            moduleName: "Hearing",
            masterDetails: [
              { name: "HearingLink" },
              { name: "HearingType" },
              { name: "HearingStatus" }
            ]
          }
        ]
      },
      RequestInfo: {
        apiId: "Rainmaker",
        msgId: Date.now().toString(),
        plainAccessRequest: {}
      }
    };

    const response = await fetch(API_ENDPOINTS.MDMS.SEARCH(tenantId as string), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    const hearingLink = data?.MdmsRes?.Hearing?.HearingLink?.[0]?.link;
    
    res.status(200).json({ link: hearingLink });
  } catch (err) {
    console.error("Error fetching hearing link:", err);
    res.status(500).json({ error: "Failed to fetch hearing link" });
  }
}
