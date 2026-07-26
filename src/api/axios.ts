import axios from 'axios'

const isDev = import.meta.env.DEV
const baseURL = isDev ? '' : import.meta.env.VITE_API_URL

const api = axios.create({ baseURL })

export default api
