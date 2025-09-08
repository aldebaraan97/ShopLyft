import { http } from "./http";

export async function createCheckoutSession(userId) {
	const { data } = await http.post(`/checkout/${userId}/create-session`);
	// data = { url: "https://checkout.stripe.com/..." }
	return data;
}
