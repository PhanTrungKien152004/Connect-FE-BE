import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { RefreshTokenResponse } from '../types'
import { accessTokenStore } from '../utils/accessTokenStore'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!apiBaseUrl) {
  throw new Error(
    'Thiếu VITE_API_BASE_URL. Hãy sao chép .env.example thành .env và khởi động lại Vite.',
  )
}

const commonConfig = {
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 10_000,
  headers: { Accept: 'application/json' },
}

const refreshClient = axios.create(commonConfig)
const apiClient = axios.create(commonConfig)

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

let refreshPromise: Promise<string> | null = null

export function refreshAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<RefreshTokenResponse>('/auth/refresh-token')
      .then((response) => {
        const accessToken = response.data.data.accessToken
        accessTokenStore.set(accessToken)
        return accessToken
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.request.use((config) => {
  const accessToken = accessTokenStore.get()

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined
    const canRefresh = Boolean(accessTokenStore.get()) && !originalRequest?._retry

    if (!originalRequest || !canRefresh) {
      accessTokenStore.clear()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const newAccessToken = await refreshAccessToken()
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return apiClient(originalRequest)
    } catch {
      accessTokenStore.clear()
      return Promise.reject(error)
    }
  },
)

export default apiClient
