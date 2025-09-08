// http.js
import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const http = axios.create({ baseURL: API_BASE_URL }); // with auth
http.interceptors.request.use((cfg) => {
	const token = localStorage.getItem("access_token");
	if (token) cfg.headers.Authorization = `Bearer ${token}`;
	return cfg;
});

export const httpNoAuth = axios.create({ baseURL: API_BASE_URL }); // no interceptor
