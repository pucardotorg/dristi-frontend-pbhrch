import type { NextApiRequest, NextApiResponse } from "next";
import { API_ENDPOINTS } from "../../../lib/config";

type OrdersTasksParams = {
  limit?: number;
  offset?: number;
  tenantId?: string;
  courtId?: string;
  forOrders?: boolean;
  forPaymentTask?: boolean;
  filingNumber?: string;
};

/**
 * API handler for fetching orders and payment tasks
 * Based on the curl request provided, this endpoint forwards the request
 * to the backend API with proper parameters
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for this endpoint
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Method not allowed. Use POST instead." });
  }

  try {
    // Extract parameters from the request body
    const {
      limit = 10,
      offset = 0,
      tenantId,
      courtId,
      forOrders = false,
      forPaymentTask = true,
      filingNumber,
    }: OrdersTasksParams = req.body;

    // Validate required parameters
    if (!courtId) {
      return res.status(400).json({ error: "courtId is required" });
    }

    if (!filingNumber) {
      return res.status(400).json({ error: "filingNumber is required" });
    }

    // Prepare the request payload
    const payload = {
      limit,
      offset,
      tenantId,
      courtId,
      forOrders,
      forPaymentTask,
      filingNumber,
    };

    // Make the request to the backend API
    const response = await fetch(API_ENDPOINTS.OPENAPI.ORDER_TASKS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({
        error: "Error fetching orders and tasks data",
        details: errorData,
      });
    }

    // Return the response from the backend API
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Orders and tasks fetch error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
