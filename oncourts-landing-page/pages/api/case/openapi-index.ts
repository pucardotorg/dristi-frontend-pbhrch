import { NextApiRequest, NextApiResponse } from 'next';
import { API_ENDPOINTS } from '../../../lib/config';

/**
 * Unified case search API route
 *
 * This endpoint accepts POST requests with different search criteria types
 * and forwards them to the consolidated backend API endpoint.
 *
 * It replaces the various separate endpoints with a single, consistent interface.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Only POST is supported." });
  }

  try {
    // Forward the request body to the centralized API endpoint
    const response = await fetch(API_ENDPOINTS.OPENAPI.CASE(req.query.tenantId as string), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      // Forward error status and message from the API
      return res.status(response.status).json({
        error: `API error: ${response.status}`,
        message: await response.text(),
      });
    }

    // Successfully forward the API response
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in case search API:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: (error as Error).message,
    });
  }
}
