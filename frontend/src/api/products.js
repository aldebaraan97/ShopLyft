import axios from "axios";

export const getProducts = async () => (await axios.get("/api/products")).data;
export const getProduct = async (id) => (await axios.get(`/api/products/${encodeURIComponent(id)}`)).data;
export const searchProducts = async (q) => (await axios.get("/api/products/search", { params: { query: q } })).data;
