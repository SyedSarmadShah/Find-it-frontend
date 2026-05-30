import axios from 'axios'
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from './tokenStorage'
import { refreshAccessToken } from '../services/authService'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api',
})

let refreshPromise: Promise<string> | null = null

function notifySessionExpired() {
  clearTokens()
  window.dispatchEvent(new Event('findit-auth-expired'))
}

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    const shouldAttemptRefresh = status === 401 && !originalRequest?._retry
    const requestUrl: string = originalRequest?.url ?? ''

    if (shouldAttemptRefresh && !requestUrl.includes('/auth/login/') && !requestUrl.includes('/auth/signup/') && !requestUrl.includes('/auth/token/refresh/')) {
      originalRequest._retry = true
      const refresh = getRefreshToken()

      if (refresh) {
        try {
          refreshPromise ??= refreshAccessToken(refresh).finally(() => {
            refreshPromise = null
          })

          const newAccess = await refreshPromise
          setAccessToken(newAccess)
          originalRequest.headers.Authorization = `Bearer ${newAccess}`
          return api(originalRequest)
        } catch {
          notifySessionExpired()
        }
      } else {
        notifySessionExpired()
      }
    }

    return Promise.reject(error)
  },
)

export default api
