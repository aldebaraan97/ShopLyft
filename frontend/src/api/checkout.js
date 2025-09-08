import { httpNoAuth } from "./http";

export async function createCheckoutSession(userId) {
	const { data } = await httpNoAuth.post(`/checkout/${userId}/create-session`);
	return data;
}
