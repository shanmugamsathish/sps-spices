import React, { useState, useEffect } from "react";
import { getCustomerOrders } from "../../apiCalls/orders";
import theme from "../../lib/theme";
import { setLoading } from "../../redux/loaderSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Package, MapPin, Calendar, CreditCard, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TITLES } from "../../lib/constant";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      dispatch(setLoading(true));
      try {
        const response = await getCustomerOrders();
        if (response?.success) {
          setOrders(response.orders || []);
        } else {
          toast.error(response?.message || "Failed to load orders");
          setOrders([]);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load orders");
        setOrders([]);
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    };
    fetchOrders();
  }, [dispatch]);

  const formatPrice = (amount, currency = "INR") => {
    const numAmount = parseFloat(amount || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(numAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "fulfilled":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "unfulfilled":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "refunded":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen py-8"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="container mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center h-screen items-center py-12">
            <div className="text-center">
              <p style={{ color: theme.colors.text.secondary }}>
                Loading your orders...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-6 sm:py-8"
      style={{ backgroundColor: theme.colors.background.main }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <h1
            className="text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            {TITLES.MY_ORDERS.TITLE}
          </h1>
          {orders.length > 0 && (
            <p
              className="mt-2 text-sm sm:text-base opacity-80"
              style={{ color: theme.colors.text.secondary }}
            >
              {orders.length} {orders.length === 1 ? "order" : "orders"} found
            </p>
          )}
        </div>

        {orders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 sm:py-20 rounded-lg"
            style={{
              backgroundColor: theme.colors.background.main,
              border: `1px solid ${theme.colors.border.light}`,
            }}
          >
            <Package
              className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-50"
              style={{ color: theme.colors.text.secondary }}
            />
            <h2
              className="text-xl sm:text-2xl font-semibold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              No orders yet
            </h2>
            <p
              className="text-sm sm:text-base text-center max-w-md"
              style={{ color: theme.colors.text.secondary }}
            >
              You haven't placed any orders yet. Start shopping to see your
              orders here!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg overflow-hidden shadow-lg"
                style={{
                  backgroundColor: theme.colors.background.main,
                  border: `1px solid ${theme.colors.border.light}`,
                }}
                onClick={() => toggleOrderDetails(order.id)}
              >
                <div
                  className="p-4 sm:p-6 border-b"
                  style={{ borderColor: theme.colors.border.light }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <h2
                          className="text-lg sm:text-xl font-bold"
                          style={{ color: theme.colors.text.primary }}
                        >
                          {order.name ||
                            `Order #${order.orderNumber || order.id}`}
                        </h2>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            order.fulfillmentStatus
                          )}`}
                        >
                          {formatStatus(order.fulfillmentStatus)}
                        </span>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                            order.financialStatus
                          )}`}
                        >
                          {formatStatus(order.financialStatus)}
                        </span>
                      </div>
                      <div
                        className="flex flex-wrap items-center gap-4 text-sm"
                        style={{ color: theme.colors.text.secondary }}
                      >
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {formatDate(order.processedAt || order.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4" />
                          <span>
                            {formatPrice(
                              order.totalPriceV2?.amount,
                              order.totalPriceV2?.currencyCode
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      className="flex items-center mb-4 gap-2 cursor-pointer"
                      
                    >
                      <h3
                        className="text-base sm:text-lg font-semibold"
                        style={{
                          color: theme.colors.text.primary,
                        }}
                      >
                        {TITLES.MY_ORDERS.ORDER_ITEMS}
                      </h3>
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          expandedOrders.has(order.id) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div
                  className={`px-4  sm:px-6  overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedOrders.has(order.id)
                      ? "max-h-[2000px] opacity-100 mt-6"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className="space-y-6 pt-4"
                    style={{ borderColor: theme.colors.border.light }}
                  >
                    <div className="space-y-4">
                      {order.lineItems?.edges?.map((edge, index) => {
                        const item = edge.node;
                        return (
                          <div
                            key={item.id || index}
                            className="flex gap-4 p-4 rounded-md"
                            style={{
                              backgroundColor: theme.colors.background.main,
                              border: `1px solid ${theme.colors.border.light}`,
                            }}
                          >
                            {/* Product Image */}
                            <div className="shrink-0">
                              {item.variant?.image?.url ? (
                                <img
                                  src={item.variant.image.url}
                                  alt={item.title}
                                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                  style={{
                                    border: `1px solid ${theme.colors.border.light}`,
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-md flex items-center justify-center"
                                  style={{
                                    backgroundColor:
                                      theme.colors.background.main,
                                    border: `1px solid ${theme.colors.border.light}`,
                                  }}
                                >
                                  <Package
                                    className="w-8 h-8 opacity-30"
                                    style={{
                                      color: theme.colors.text.secondary,
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <h4
                                className="text-base sm:text-lg font-semibold mb-1 cursor-pointer hover:underline"
                                style={{ color: theme.colors.text.primary }}
                                onClick={() => navigate(`/product-details/${item.product_id}`)}
                              >
                                {item.title}
                              </h4>
                              {item.variant?.title && (
                                <p
                                  className="text-sm mb-2"
                                  style={{ color: theme.colors.text.secondary }}
                                >
                                  Variant: {item.variant.title}
                                </p>
                              )}
                              <div className="flex items-center gap-4 text-sm">
                                <span
                                  style={{ color: theme.colors.text.secondary }}
                                >
                                  Quantity:{" "}
                                  <span
                                    className="font-semibold"
                                    style={{ color: theme.colors.text.primary }}
                                  >
                                    {item.quantity}
                                  </span>
                                </span>
                                <span
                                  className="font-semibold"
                                  style={{ color: theme.colors.text.primary }}
                                >
                                  {formatPrice(
                                    item.originalTotalPrice?.amount,
                                    item.originalTotalPrice?.currencyCode
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Order Summary */}
                    <div>
                      <h3
                        className="text-base font-semibold mb-3"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {TITLES.MY_ORDERS.ORDER_SUMMARY}
                      </h3>
                      <div
                        className="space-y-2 text-sm p-4 rounded-md"
                        style={{
                          backgroundColor: theme.colors.background.main,
                          border: `1px solid ${theme.colors.border.light}`,
                        }}
                      >
                        <div className="flex justify-between">
                          <span style={{ color: theme.colors.text.secondary }}>
                            Subtotal:
                          </span>
                          <span style={{ color: theme.colors.text.primary }}>
                            {formatPrice(
                              order.subtotalPriceV2?.amount,
                              order.subtotalPriceV2?.currencyCode
                            )}
                          </span>
                        </div>
                        {order.gst?.hasGst && order.gst.gstPercentage > 0 ? (
                          <>
                            <div className="flex justify-between">
                              <span style={{ color: theme.colors.text.secondary }}>
                                GST ({order.gst.gstPercentage}%):
                              </span>
                              <span style={{ color: theme.colors.text.primary }}>
                                {formatPrice(
                                  order.gst.gstAmount,
                                  order.totalPriceV2?.currencyCode
                                )}
                              </span>
                            </div>
                            <div
                              className="flex justify-between pt-2 border-t font-bold text-base"
                              style={{ borderColor: theme.colors.border.light }}
                            >
                              <span style={{ color: theme.colors.text.primary }}>
                                Total (Including GST):
                              </span>
                              <span style={{ color: theme.colors.accent.primary }}>
                                {formatPrice(
                                  order.gst.total || (parseFloat(order.gst.subtotal || 0) + parseFloat(order.gst.gstAmount || 0)),
                                  order.totalPriceV2?.currencyCode
                                )}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span style={{ color: theme.colors.text.secondary }}>
                                Tax:
                              </span>
                              <span style={{ color: theme.colors.text.primary }}>
                                {formatPrice(
                                  order.totalTaxV2?.amount || 0,
                                  order.totalPriceV2?.currencyCode
                                )}
                              </span>
                            </div>
                            <div
                              className="flex justify-between pt-2 border-t font-bold text-base"
                              style={{ borderColor: theme.colors.border.light }}
                            >
                              <span style={{ color: theme.colors.text.primary }}>
                                Total:
                              </span>
                              <span style={{ color: theme.colors.accent.primary }}>
                                {formatPrice(
                                  order.totalPriceV2?.amount,
                                  order.totalPriceV2?.currencyCode
                                )}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    {order.shippingAddress && (
                      <div>
                        <h3
                          className="text-base font-semibold mb-3 flex items-center gap-2"
                          style={{ color: theme.colors.text.primary }}
                        >
                          <MapPin className="w-4 h-4" />
                          {TITLES.MY_ORDERS.SHIPPING_ADDRESS}
                        </h3>
                        <div
                          className="text-sm space-y-1 p-4 rounded-md"
                          style={{
                            backgroundColor: theme.colors.background.main,
                            border: `1px solid ${theme.colors.border.light}`,
                          }}
                        >
                          <p
                            style={{
                              color: theme.colors.text.primary,
                              fontWeight: "500",
                            }}
                          >
                            {order.shippingAddress.name ||
                              `${order.shippingAddress.first_name || ""} ${
                                order.shippingAddress.last_name || ""
                              }`.trim() ||
                              "N/A"}
                          </p>
                          {order.shippingAddress.address1 && (
                            <p style={{ color: theme.colors.text.secondary }}>
                              {order.shippingAddress.address1}
                            </p>
                          )}
                          {order.shippingAddress.address2 && (
                            <p style={{ color: theme.colors.text.secondary }}>
                              {order.shippingAddress.address2}
                            </p>
                          )}
                          <p style={{ color: theme.colors.text.secondary }}>
                            {[
                              order.shippingAddress.city,
                              order.shippingAddress.province,
                              order.shippingAddress.zip,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                          {order.shippingAddress.country && (
                            <p style={{ color: theme.colors.text.secondary }}>
                              {order.shippingAddress.country}
                            </p>
                          )}
                          {order.shippingAddress.phone && (
                            <p
                              style={{ color: theme.colors.text.secondary }}
                              className="mt-2"
                            >
                              📞 {order.shippingAddress.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;