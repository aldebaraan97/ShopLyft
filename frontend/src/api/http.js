import axios from "axios";
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const http = axios.create({ baseURL: API_BASE_URL });
http.interceptors.request.use((config) => {
	const token = localStorage.getItem("access_token"); // or wherever you store it
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});
