import axios from "axios"

let accessToken: string | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

const api = axios.create({
  baseURL: "http://localhost:8000/api",
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
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true
      try {
        const { data } = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          { withCredentials: true }
        )
        setAccessToken(data.access_token)
        error.config.headers.Authorization = `Bearer ${data.access_token}`
        return api(error.config)
      } catch {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
