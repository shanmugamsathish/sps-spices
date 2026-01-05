import { API_URL } from "../lib/constant";

const getAuthHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  const token = sessionStorage.getItem("token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const shopifyToken = sessionStorage.getItem("shopifyAccessToken");
  if (shopifyToken) {
    headers["x-shopify-token"] = shopifyToken;
  }

  return headers;
};

// Create a payment order
export const createPaymentOrder = async (orderData) => {
  try {
    const response = await fetch(`${API_URL}/payment/create-order`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create payment order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating payment order:", error);
    throw error;
  }
};

// Verify a payment order
export const verifyPaymentOrder = async (
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
) => {
  try {
    const response = await fetch(`${API_URL}/payment/verify`, {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Payment verification failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying payment:", error);
    throw error;
  }
};
