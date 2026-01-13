import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { selectCart, clearCart } from "../../redux/productSlice";
import { selectUser } from "../../redux/userSlice";
import { createPaymentOrder, verifyPaymentOrder } from "../../apiCalls/payment";
import loadRazorpayScript from "../../utils/razorpayLoader";
import theme from "../../lib/theme";
import { ROUTES } from "../../lib/constant";
import PaymentPageComponent from "../../Components/PaymentPageComponent";
import { setLoading } from "../../redux/loaderSlice";
import { getCustomerById } from "../../apiCalls/customers";
import AdminAddCustomerForm from "../../Components/AdminAddCustomerComponent/AdminAddCustomerForm";
import { useLocation } from "../../hooks/useLocation";

function PaymentPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const customerId = user?.customer?.id;
  const loading = useSelector((state) => state.loader.isLoading);
  const location = useRouterLocation();
  const isPaymentPage = location.pathname === "/payment";
  
  // Location management for refrigerated products
  const { location: userLocation, requestLocation, validateLocation } = useLocation();
  const [locationError, setLocationError] = useState(null);
  
  // Payment status states
  const [paymentStatus, setPaymentStatus] = useState(null); 
  const [error, setError] = useState(null);
  const [isRazorpayLoading, setIsRazorpayLoading] = useState(false); 

  // Form data states
  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    password: "",
    password_confirmation: "",
    accepts_marketing: false,
    send_email_welcome: true,
  });

  const [addresses, setAddresses] = useState([
    {
      first_name: "",
      last_name: "",
      company: "",
      address1: "",
      address2: "",
      city: "",
      province: "",
      country: "India",
      zip: "",
      phone: "",
    },
  ]);

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = useCallback(() => {
    const errors = {};
    const primaryAddress = addresses[0] || {};

    // Required customer fields
    if (!formData.first_name?.trim()) {
      errors.first_name = "First name is required";
    }
    if (!formData.last_name?.trim()) {
      errors.last_name = "Last name is required";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "Phone number is required";
    }

    // Required address fields
    if (!primaryAddress.first_name?.trim()) {
      errors.first_name = "First name is required";
    }
    if (!primaryAddress.last_name?.trim()) {
      errors.last_name = "Last name is required";
    }
    if (!primaryAddress.address1?.trim()) {
      errors.address1 = "Address line 1 is required";
    }
    if (!primaryAddress.city?.trim()) {
      errors.city = "City is required";
    }
    if (!primaryAddress.country?.trim()) {
      errors.country = "Country is required";
    }
    if (!primaryAddress.province?.trim()) {
      errors.province = "State/Province is required";
    }
    if (!primaryAddress.zip?.trim()) {
      errors.zip = "ZIP/Postal code is required";
    }

    setValidationErrors(errors);
    return {
      valid: Object.keys(errors).length === 0,
      errors: errors,
    };
  }, [formData, addresses]);

  useEffect(() => {
    if (formData.first_name || addresses[0]?.address1) {
      validateForm();
    } else {
      setValidationErrors({});
    }
  }, [formData, addresses, validateForm]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleAddressChange = useCallback((index, field, value) => {
    const updatedAddresses = [...addresses];
    updatedAddresses[index][field] = value;
    setAddresses(updatedAddresses);
    // Clear validation error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [addresses, validationErrors]);

  const fetchCustomerData = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await getCustomerById(customerId);
      if (response) {
        const customerObj = response || {};
        setFormData(customerObj);
        const defaultAddress = {
          first_name: customerObj?.first_name || "",
          last_name: customerObj?.last_name || "",
          company: "",
          address1: "",
          address2: "",
          city: "",
          province: "",
          country: "India",
          zip: "",
          phone: customerObj?.phone || "",
        };
        setAddresses(
          Array.isArray(customerObj?.addresses) && customerObj.addresses.length
            ? customerObj.addresses
            : [defaultAddress]
        );
      }
    } catch (error) {
      console.error("Error fetching customer data:", error);
      toast.error("Failed to fetch customer data");
    } finally {
      dispatch(setLoading(false));
    }
  }, [customerId, dispatch]);

  useEffect(() => {
    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId, fetchCustomerData]);

  // This is used for display only - backend will recalculate from Shopify
  const calculateCartTotal = useCallback(() => {
    if (!cart || !cart.cost?.subtotalAmount?.amount) {
      return 0;
    }
    return parseFloat(cart.cost.subtotalAmount.amount);
  }, [cart]);

  // Calculate total items count
  const calculateCartItemsCount = useCallback(() => {
    if (!cart || !cart.lines || !cart.lines.edges) {
      return 0;
    }
    return cart.lines.edges.reduce(
      (sum, edge) => sum + (edge.node.quantity || 0),
      0
    );
  }, [cart]);

  const cartTotal = calculateCartTotal();
  const cartItemsCount = calculateCartItemsCount();
// redirect if cart is empty
  useEffect(() => {
    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      toast.error("Your cart is empty");
      navigate(ROUTES.CART);
    }
  }, [cart, navigate]);


  const isFormValid = Object.keys(validationErrors).length === 0;

  const handlePayment = useCallback(async () => {
    // Validate form before proceeding
    const validation = validateForm();
    if (!validation.valid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate cart total
    if (cartTotal <= 0) {
      toast.error("Invalid cart total. Please add items to cart.");
      return;
    }

    // Get user location for refrigerated product validation
    let currentLocation = userLocation;
    if (!currentLocation) {
      try {
        // Try to get cached location first
        const cached = localStorage.getItem('userLocation');
        if (cached) {
          const data = JSON.parse(cached);
          const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
          if (Date.now() - data.timestamp < CACHE_DURATION) {
            currentLocation = { lat: data.lat, lng: data.lng };
          }
        }

        // If no cached location, request it
        if (!currentLocation) {
          toast.error("Checking delivery location for refrigerated products...", { duration: 2000 });
          currentLocation = await requestLocation();
        }
      } catch (locationErr) {
        console.error("Error getting location:", locationErr);
        // If location is denied but cart might have refrigerated products, validate anyway
        // Backend will reject if needed
      }
    }

    // Validate location for refrigerated products before payment
    try {
      const cartId = cart?.id;
      if (cartId && currentLocation) {
        const locationValidation = await validateLocation({ cartId });
        if (!locationValidation.allowed && locationValidation.isRefrigerated) {
          toast.error(
            locationValidation.error ||
            `Refrigerated products are only available within 30 km radius. You are ${locationValidation.distance || 'too far'} km away.`
          );
          return;
        }
      } else if (!currentLocation) {
        // If no location and cart might have refrigerated products, warn user
        // But allow to proceed - backend will validate
        toast.warning("Location not available. Refrigerated products require location access.", { duration: 3000 });
      }
    } catch (locationErr) {
      console.error("Error validating location:", locationErr);
      // Continue with payment - backend will validate
    }

    // Reset error and payment status
    setError(null);
    setPaymentStatus(null);
    setIsRazorpayLoading(true);

    try {
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        throw new Error("Failed to load Razorpay checkout script. Please refresh the page and try again.");
      }

      setIsRazorpayLoading(false);
      dispatch(setLoading(true));
      // toast.info("Creating order...", { duration: 2000 });

      const lineItems = cart.lines.edges.map((edge) => ({
        variantId: edge.node.merchandise.id,
        quantity: edge.node.quantity,
      }));

      const orderPayload = {
        amount: cartTotal, 
        currency: "INR",
        lineItems: lineItems,
        customerId: customerId || null,
        email: formData.email || user?.email || "",
        customer: {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          email: formData.email || user?.email,
        },
        shippingAddress: addresses[0] || null,
        billingAddress: addresses[0] || null,
        userLat: currentLocation?.lat || null,
        userLng: currentLocation?.lng || null,
      };

      const orderResponse = await createPaymentOrder(orderPayload);

      if (!orderResponse.success) {
        // Check if it's a location validation error
        if (orderResponse.error === "LOCATION_OUT_OF_RANGE") {
          toast.error(orderResponse.message || "Refrigerated products are only available within 30 km radius.");
          setLocationError(orderResponse.message);
          throw new Error(orderResponse.message);
        }
        throw new Error(
          orderResponse.message || "Failed to create payment order"
        );
      }

      const { key, orderId, currency, amount } = orderResponse;

      dispatch(setLoading(false));
      // toast.info("Opening payment gateway...", { duration: 2000 });

      const userName = `${formData.first_name || ""} ${formData.last_name || ""}`.trim() || user?.firstName || "";
      const userEmail = formData.email || user?.email || "";
      const userContact = formData.phone || user?.phone || user?.contact || "";

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
            setError(null);
            const verificationResponse = await verifyPaymentOrder(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            if (verificationResponse.success) {
              setPaymentStatus("success");
              // clear cart
              dispatch(clearCart());
              localStorage.removeItem("cartId");

              toast.success("Payment Successful! Order placed successfully.");

              // Redirect to orders page after 2 seconds
              setTimeout(() => {
                navigate(ROUTES.HOME);
              }, 2000);
            } else {
              // Payment verification failed
              setPaymentStatus("failed");
              setError(
                verificationResponse.message || "Payment verification failed"
              );
              toast.error(
                "Payment verification failed. Please contact support."
              );
              // DO NOT clear cart on verification failure
            }
          } catch (error) {
            // Error during payment verification
            setPaymentStatus("failed");
            setError(error.message || "Error verifying payment");
            toast.error("Error verifying payment. Please contact support.");
            console.error("Payment verification error:", error);
            // DO NOT clear cart on error
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

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", function (response) {
        dispatch(setLoading(false));
        const errorMessage =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed. Please try again with a different payment method.";
        setError(errorMessage);
        setPaymentStatus("failed");
        toast.error(errorMessage);
        console.error("Payment failed:", response.error);
        // DO NOT clear cart on payment failure
      });

      // Open Razorpay checkout popup
      razorpay.open();
    } catch (error) {
      console.error("Payment error:", error);
      setError(error.message || "An error occurred during payment");
      toast.error(error.message || "Failed to process payment");
      setPaymentStatus("failed");
      setIsRazorpayLoading(false);
      dispatch(setLoading(false));
      // DO NOT clear cart on error
    }
  },     [
    cartTotal,
    cart,
    dispatch,
    navigate,
    user,
    formData,
    addresses,
    customerId,
    validateForm,
    userLocation,
    requestLocation,
    validateLocation,
  ]);

  if (loading && !paymentStatus && !isRazorpayLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="text-center">
          <p style={{ color: theme.colors.text.primary }}>
            Loading payment page...
          </p>
        </div>
      </div>
    );
  }

  if (isRazorpayLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="text-center">
          <p style={{ color: theme.colors.text.primary }}>
            Loading payment gateway...
          </p>
        </div>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#10B981" }}
            >
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

  if (paymentStatus === "failed") {
    return (
      <div
        className="min-h-screen flex items-center justify-center py-8 px-4"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <div
              className="mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#EF4444" }}
            >
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
              <p
                className="mb-4"
                style={{ color: theme.colors.text.secondary }}
              >
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

  return (
    <div
      className="min-h-screen py-8 px-4"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <div className="container mx-auto max-w-7xl flex flex-col lg:flex-row items-start gap-6">
        <div className="w-full lg:w-2/3">
          <AdminAddCustomerForm
            formData={formData}
            handleInputChange={handleInputChange}
            addresses={addresses}
            handleAddressChange={handleAddressChange}
            isPaymentPage={isPaymentPage}
            validationErrors={validationErrors}
          />
        </div>

        <div className="w-full lg:w-1/3">
          <PaymentPageComponent
            cartTotal={cartTotal}
            cartItemsCount={cartItemsCount}
            error={error}
            loading={loading}
            handlePayment={handlePayment}
            isFormValid={isFormValid}
          />
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
