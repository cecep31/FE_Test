import { getCookie, deleteCookie } from "./utils";

/**
 * Check if user is authenticated by verifying token existence
 * @returns boolean indicating if user is authenticated
 */
export function isAuthenticated(): boolean {
  const token = getCookie("token");
  return !!token;
}

/**
 * Get the current authentication token
 * @returns token string or null if not authenticated
 */
export function getAuthToken(): string | null {
  return getCookie("token");
}

/**
 * Clear authentication token
 */
export function logout(): void {
  deleteCookie("token");
  window.location.href = "/login";
}
