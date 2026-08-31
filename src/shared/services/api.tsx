import axios from "axios";

let _getToken: (() => string | null) | null = null;

export function setTokenGetter(fn: () => string | null): void {
  _getToken = fn;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = _getToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let axios/the browser set multipart/form-data + boundary automatically;
  // only force JSON when the body isn't FormData.
  if (!(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }
  return config;
});

export default api;
