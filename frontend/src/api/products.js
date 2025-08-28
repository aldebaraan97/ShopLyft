import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getProducts = async () => (await axios.get(`${API_BASE_URL}/products`)).data;
export const getProduct = async (id) => (await axios.get(`${API_BASE_URL}/products/${encodeURIComponent(id)}`)).data;
export const searchProducts = async (q) => (await axios.get(`${API_BASE_URL}/products/search`, { params: { query: q } })).data;
