import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { selectCart, clearCart } from "../../redux/productSlice";
import { selectUser } from "../../redux/userSlice";
import { createPaymentOrder, verifyPaymentOrder } from "../../apiCalls/payment";
import loadRazorpayScript from "../../utils/razorpayLoader";
import theme from "../../lib/theme";
import { ROUTES } from "../../lib/constant";
import PaymentPageComponent from "../../Components/PaymentPageComponent";
import { setLoading } from "../../redux/loaderSlice";

function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const loading = useSelector(state => state.loader.isLoading);
  
  const [paymentStatus, setPaymentStatus] = useState(null); 
  const [error, setError] = useState(null);

  // Calculate cart total
  const calculateCartTotal = useCallback(() => {
    if (!cart || !cart.cost?.subtotalAmount?.amount) {
      return 0;
    }
    return parseFloat(cart.cost.subtotalAmount.amount);
  }, [cart]);

  const cartTotal = calculateCartTotal();

  // Redirect if cart is empty
  useEffect(() => {
    if (!cart || !cart.lines || !cart.lines.edges || cart.lines.edges.length === 0) {
      toast.error("Your cart is empty");
      navigate(ROUTES.CART);
    }
  }, [cart, navigate]);

  const handlePayment = useCallback(async () => {
    // Validate cart total
    if (cartTotal <= 0) {
      toast.error("Invalid cart total. Please add items to cart.");
      return;
    }

    dispatch(setLoading(true));
    setError(null);
    setPaymentStatus(null);

    try {
      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay checkout script");
      }

      // Create payment order via backend
      const orderResponse = await createPaymentOrder(cartTotal);
      
      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create payment order");
      }

      const { key, orderId, currency, amount } = orderResponse;

      // Get user info for prefill
      const userName = user?.name || user?.firstName || "";
      const userEmail = user?.email || "";
      const userContact = user?.phone || user?.contact || "";

      // Open Razorpay checkout popup
      const options = {
        key: key, 
        amount: amount, 
        currency: currency || "INR",
        order_id: orderId,
        name: "SPS Spices and Dry Fruits",
        description: "Order Payment",
        theme: {
          color: theme.colors.accent.primary || "#B8860B",
        },
        prefill: {
          name: userName,
          email: userEmail,
          contact: userContact,
        },
        handler: async function (response) {
          try {
            dispatch(setLoading(true));
            
            const verificationResponse = await verifyPaymentOrder(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );

            if (verificationResponse.success) {
              setPaymentStatus("success");
              dispatch(clearCart());
              localStorage.removeItem("cartId");
              
              toast.success("Payment Successful!");
              
              setTimeout(() => {
                navigate(ROUTES.MY_ORDERS);
              }, 2000);
            } else {
              setPaymentStatus("failed");
              setError(verificationResponse.message || "Payment verification failed");
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            setPaymentStatus("failed");
            setError(error.message || "Error verifying payment");
            toast.error("Error verifying payment. Please contact support.");
            console.error("Payment verification error:", error);
          } finally {
            dispatch(setLoading(false));
          }
        },
        modal: {
          ondismiss: function () {
            dispatch(setLoading(false));  
            toast.error("Payment cancelled");
          },
        },
      };

      // Initialize Razorpay checkout
      const razorpay = new window.Razorpay(options);
      
      razorpay.on("payment.failed", function (response) {
        dispatch(setLoading(false));  
        const errorMessage = response.error?.description || response.error?.reason || "Payment failed. Please try again with a different payment method.";
        setError(errorMessage);
        setPaymentStatus("failed");
        toast.error(errorMessage);
        console.error("Payment failed:", response.error);
      });

      razorpay.open();

    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "An error occurred during payment");
      toast.error(error.message || "Failed to process payment");
      setPaymentStatus("failed");
    } finally {
      dispatch(setLoading(false));  
    }
  }, [cartTotal, dispatch, navigate, user]);

  // Loading state
  if (loading && !paymentStatus) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="text-center">
          <p style={{ color: theme.colors.text.primary }}>Processing payment...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (paymentStatus === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                 style={{ backgroundColor: "#10B981" }}>
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Payment Successful!
            </h2>
            <p style={{ color: theme.colors.text.secondary }}>
              Your order has been placed successfully. Redirecting to orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Failure state
  if (paymentStatus === "failed") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
                 style={{ backgroundColor: "#EF4444" }}>
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Payment Failed
            </h2>
            {error && (
              <p className="mb-4" style={{ color: theme.colors.text.secondary }}>
                {error}
              </p>
            )}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setPaymentStatus(null);
                  setError(null);
                }}
                className="px-6 py-2 rounded-md font-semibold"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => navigate(ROUTES.CART)}
                className="px-6 py-2 rounded-md font-semibold border"
                style={{
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main payment page
  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <PaymentPageComponent cartTotal={cartTotal} error={error} loading={loading} handlePayment={handlePayment} />
    </div>
  );
}

export default PaymentPage;