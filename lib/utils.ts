import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper functions for cookie management
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null
  return null
}

export function setCookie(name: string, value: string, days: number = 7): void {
  if (typeof document === "undefined") return

  let expires = ""
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = `; expires=${date.toUTCString()}`
  }

  // Set cookie with secure flags for production
  const isProduction = process.env.NODE_ENV === "production"
  const secureFlag = isProduction ? "; Secure" : ""
  const sameSiteFlag = isProduction ? "; SameSite=Lax" : ""

  document.cookie = `${name}=${value || ''}${expires}; path=/${secureFlag}${sameSiteFlag}`
}

export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return
  document.cookie = `${name}=; Max-Age=-99999999; path=/`
}
