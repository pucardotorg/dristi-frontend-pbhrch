import { API_ENDPOINTS } from '../../../../lib/config';

export default async function handler(req, res) {
  const { caseNumber } = req.query;
  if (!caseNumber) {
    return res.status(400).json("Bad Request");
  }

  const url = API_ENDPOINTS.OPENAPI.CASE_BY_CNR(caseNumber as string);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message || "Internal Server Error" });
  }
}
