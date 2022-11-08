
import axios from 'axios'

const API_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_SERVER_URL
    : `http://localhost:8000/api`

export const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  async function refreshInterceptor(config) {
    try {
      const token = window.localStorage.getItem('token')
      config.headers.Authorization = token !== null && `Bearer ${token}`
      config.xsrfCookieName = 'csrftoken'
      config.xsrfHeaderName = 'X-CSRFToken'
      config.headers['X-CSRFToken'] = document.cookie.split(';')[0].split('=')[1]
      config.cookie['csrftoken'] = document.cookie.split(';')[0].split('=')[1]
    } catch {
      // No logged-in user: don't set auth header
    }
    return config
  },
  (e) => Promise.reject(e)
)