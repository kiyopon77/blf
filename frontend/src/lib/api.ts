import axios from "axios"

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

const baseURL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const isRefreshCall = error.config?.url?.includes("/auth/refresh")
    if (error.response?.status === 401 && !error.config._retry && !isRefreshCall) {
      error.config._retry = true
      try {
        const { data } = await axios.post(
          `${baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        )
        setAccessToken(data.access_token)
        error.config.headers.Authorization = `Bearer ${data.access_token}`
        return api(error.config)
      } catch {
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
