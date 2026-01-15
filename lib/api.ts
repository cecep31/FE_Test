import axios from "axios"
import { config } from "@/config"

export const api = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
})

// Add auth token interceptor
api.interceptors.request.use((req) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  if (token) req.headers.Authorization = `Bearer ${token}`
  return req
})
