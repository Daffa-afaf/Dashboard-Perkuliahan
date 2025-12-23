/*
SCREENSHOT: Report 2 — Role & Permission
File: src/Utils/AxiosInstance.jsx
Purpose: Central Axios instance with request/response logging. Capture
interceptor logs to provide network evidence during screenshot report.
*/

import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:3001", // alamat json-server
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

AxiosInstance.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.message, error.config?.url);
    return Promise.reject(error);
  }
);

AxiosInstance.interceptors.request.use(config => {
  console.log('API Request:', config.method?.toUpperCase(), config.baseURL + config.url);
  return config;
});

export default AxiosInstance;
