import axios from "axios";
import { getCurrentUser } from "./auth";

const API_BASE_URL = "http://localhost:8080/api";

export async function getCart(userId) {
	const { data } = await axios.get(`${API_BASE_URL}/cart/${userId}`);
	return data;
}

export async function addItem(userId, productId, quantity = 1) {
	const { data } = await axios.post(
		`${API_BASE_URL}/cart/${userId}/items`,
		{ productId, quantity },
		{ headers: { "Content-Type": "application/json" } }
	);
	// server returns the updated cart
	return data;
}

export async function updateItem(userId, productId, quantity) {
	const { data } = await axios.put(
		`${API_BASE_URL}/cart/${userId}/items/${productId}`,
		{ quantity },
		{ headers: { "Content-Type": "application/json" } }
	);
	return data;
}

export async function removeItem(userId, productId) {
	await axios.delete(`${API_BASE_URL}/cart/${userId}/items/${productId}`);
}

export async function clearCart(userId) {
	await axios.delete(`${API_BASE_URL}/cart/${userId}`);
}

/** Convenience helper that uses localStorage's current user. */
export async function addToMyCart(productId, quantity = 1) {
	const { userId } = getCurrentUser() || {};
	if (!userId) throw new Error("LOGIN_REQUIRED");
	return addItem(userId, productId, quantity);
}
