import { http } from "./http";

export async function getOrders(userId) {
	const { data } = await http.get(`/orders/${userId}`);
	// Accept a few possible shapes and always return an array
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.orders)) return data.orders;
	if (Array.isArray(data?.content)) return data.content; // if you ever page it
	return [];
}
