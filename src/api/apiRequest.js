import { api } from 'api/api'

const createApi = (api) => (url, placeholder) => {
  const requestTemplate =
    (reqFn) =>
    async (...args) => {
      let res
      try {
        res = await reqFn(...args)
      } catch (err) {
        if (process.env.NODE_ENV !== 'production') {
          // TODO: Add centralized error logging
          console.log(`Error at ${url}: `, err)
        }

        return {
          result: placeholder,
          error: {
            message: err?.response?.data?.error || err.message,
            status: err?.response?.status,
            data: err?.response?.data,
          },
        }
      }

      return {
        result: res?.data ? res.data : placeholder,
      }
    }

  const get = requestTemplate(() => api.get(url))

  const post = requestTemplate((params, config) => api.post(url, params, config))

  const put = requestTemplate((data) => api.put(url, data))

  return {
    get,
    post,
    put,
  }
}

// Old api will return data in 'res.data.result'
// For new api, will use 'res.data'
const apiRequest = createApi(api)

export { apiRequest }