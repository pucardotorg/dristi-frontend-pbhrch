/**
 * Handles authentication errors by redirecting to the CTC apply page.
 * @param {Response} response - The fetch response object.
 */
export const handleAuthError = (response) => {
  if (response.status === 401 && typeof window !== "undefined") {
    window.location.href = "/certified-true-copies";
    return true;
  }
  return false;
};
