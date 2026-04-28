import type { ESignRequestData, ESignResponseData } from "../types";

/**
 * Calls the Next.js /api/esign proxy, which forwards the request to the
 * backend openapi esign endpoint.
 *
 * This replaces `Digit.DRISTIService.eSignService`.
 */
export async function eSignService(
  data: ESignRequestData,
): Promise<ESignResponseData> {
  const response = await fetch(`/api/esign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      window.location.href = "/certified-true-copies";
      return Promise.reject(`Auth Error: 401 Unauthorized for eSign`);
    }
    const errorBody = await response.text();
    return Promise.reject(
      `eSign request failed [${response.status}]: ${errorBody}`,
    );
  }

  return response.json();
}
