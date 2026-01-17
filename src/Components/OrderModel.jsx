import React, { useState, useEffect } from "react";
import { getOrderById, getAdminOrderById } from "../apiCalls/orders";
import theme from "../lib/theme";
import { setLoading } from "../redux/loaderSlice";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { Package, MapPin, Calendar, CreditCard, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TITLES } from "../lib/constant";

function OrderModel({ isOpen, onClose, orderId, isAdmin = false }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen || !orderId) return;

    const fetchOrderById = async () => {
      setIsLoading(true);
      dispatch(setLoading(true));
      try {
        const response = isAdmin 
          ? await getAdminOrderById(orderId)
          : await getOrderById(orderId);
        
        if (response?.success) {
          setOrder(response.order || null);
        } else {
          toast.error(response?.message || "Failed to load order");
          setOrder(null);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to load order");
        setOrder(null);
      } finally {
        setIsLoading(false);
        dispatch(setLoading(false));
      }
    };

    fetchOrderById();
  }, [dispatch, orderId, isOpen, isAdmin]);

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
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case "fulfilled":
      case "paid":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "unfulfilled":
      case null:
      case "null":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
      case "refunded":
      case "voided":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status || status === "null") return "Pending";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  // Transform REST API order format to match component expectations
  const transformOrder = (orderData) => {
    if (!orderData) return null;

    // If it's already GraphQL format (has lineItems.edges), return as is
    if (orderData.lineItems?.edges) {
      return orderData;
    }

    return {
      ...orderData,
      name: orderData.name,
      orderNumber: orderData.order_number,
      fulfillmentStatus: orderData.fulfillment_status,
      financialStatus: orderData.financial_status,
      processedAt: orderData.created_at,
      createdAt: orderData.created_at,
      totalPriceV2: {
        amount: orderData.total_price,
        currencyCode: orderData.currency || "INR"
      },
      subtotalPriceV2: {
        amount: orderData.gst?.hasGst ? orderData.gst.subtotal : (orderData.subtotal_price || orderData.total_price),
        currencyCode: orderData.currency || "INR"
      },
      totalTaxV2: {
        amount: orderData.gst?.hasGst ? orderData.gst.gstAmount : (orderData.total_tax || 0),
        currencyCode: orderData.currency || "INR"
      },
      lineItems: {
        edges: (orderData.line_items || []).map(item => ({
          node: {
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            variant: {
              title: item.variant_title || item.title,
              image: item.image ? { url: typeof item.image === 'string' ? item.image : (item.image.src || item.image.url) } : null
            },
            product_id: item.product_id,
            originalTotalPrice: {
              amount: item.price,
              currencyCode: orderData.currency || "INR"
            },
            _originalItem: item 
          }
        }))
      },
      shippingAddress: orderData.shipping_address ? {
        name: orderData.shipping_address.name,
        first_name: orderData.shipping_address.first_name,
        last_name: orderData.shipping_address.last_name,
        address1: orderData.shipping_address.address1,
        address2: orderData.shipping_address.address2,
        city: orderData.shipping_address.city,
        province: orderData.shipping_address.province,
        zip: orderData.shipping_address.zip,
        country: orderData.shipping_address.country,
        phone: orderData.shipping_address.phone
      } : null
    };
  };

  const transformedOrder = transformOrder(order);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 overflow-auto">
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 my-8"
        style={{
          maxHeight: "90vh",
          overflowY: "auto",
          border: `1px solid ${theme.colors.border.light}`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-200 transition cursor-pointer animate-pulse bg-gray-200"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <p style={{ color: theme.colors.text.secondary }}>
              Loading your order...
            </p>
          </div>
        ) : order === null ? (
          <div className="flex flex-col items-center justify-center py-16">
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
              You haven't placed any orders yet. Start shopping to see your orders here!
            </p>
          </div>
        ) : transformedOrder ? (
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold" style={{ color: theme.colors.text.primary }}>
                {isAdmin ? "Order Details" : TITLES.MY_ORDERS.TITLE}
              </h1>
              <p className="text-sm sm:text-base mt-1" style={{ color: theme.colors.text.secondary }}>
                {transformedOrder.id}
              </p>
            </div>

            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold" style={{ color: theme.colors.text.primary }}>
                  {transformedOrder.name || `Order #${transformedOrder.orderNumber || transformedOrder.id}`}
                </h2>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transformedOrder.fulfillmentStatus)}`}>
                    {formatStatus(transformedOrder.fulfillmentStatus)}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transformedOrder.financialStatus)}`}>
                    {formatStatus(transformedOrder.financialStatus)}
                  </span>
                </div>
              </div>
              <div className="flex flex-col sm:items-end gap-1 text-sm" style={{ color: theme.colors.text.secondary }}>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(transformedOrder.processedAt || transformedOrder.createdAt || transformedOrder.created_at || order?.created_at)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>{formatPrice(
                    transformedOrder.gst?.hasGst && transformedOrder.gst.total 
                      ? transformedOrder.gst.total 
                      : (transformedOrder.totalPriceV2?.amount || transformedOrder.total_price || order?.total_price || 0),
                    transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
                  )}</span>
                </div>
              </div>
            </div>

            {/* Line Items */}
            {transformedOrder.lineItems?.edges && transformedOrder.lineItems.edges.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-base font-semibold" style={{ color: theme.colors.text.primary }}>
                  Order Items
                </h3>
                {transformedOrder.lineItems.edges.map((edge) => {
                  const item = edge.node;
                  // Get image from transformed order - item has _originalItem reference or variant.image
                  const imageUrl = item.variant?.image?.url || item._originalItem?.image || (typeof item._originalItem?.image === 'string' ? item._originalItem.image : (item._originalItem?.image?.src || item._originalItem?.image?.url));
                  
                  return (
                    <div key={item.id} className="flex gap-4 p-4 rounded-md border" style={{ borderColor: theme.colors.border.light }}>
                      <div className="shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.title}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-gray-100 rounded-md">
                            <Package className="w-8 h-8 opacity-30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`text-base sm:text-lg font-semibold mb-1 ${item.product_id ? 'cursor-pointer hover:underline' : ''}`}
                          style={{ color: theme.colors.text.primary }}
                          onClick={() => item.product_id && navigate(`/product-details/${item.product_id}`)}
                        >
                          {item.title}
                        </h4>
                        {item.variant?.title && item.variant.title !== item.title && (
                          <p className="text-sm mb-2" style={{ color: theme.colors.text.secondary }}>
                            Variant: {item.variant.title}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <span style={{ color: theme.colors.text.secondary }}>
                            Quantity: <span className="font-semibold" style={{ color: theme.colors.text.primary }}>{item.quantity}</span>
                          </span>
                          <span className="font-semibold" style={{ color: theme.colors.text.primary }}>
                            {formatPrice(item.originalTotalPrice?.amount || item.price, item.originalTotalPrice?.currencyCode || transformedOrder.currency || order?.currency || "INR")}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-4" style={{ color: theme.colors.text.secondary }}>
                No items found in this order.
              </div>
            )}

            {/* Order Summary */}
            <div>
              <h3 className="text-base font-semibold mb-3" style={{ color: theme.colors.text.primary }}>
                {TITLES.MY_ORDERS.ORDER_SUMMARY}
              </h3>
              <div className="space-y-2 text-sm p-4 rounded-md border" style={{ borderColor: theme.colors.border.light }}>
                <div className="flex justify-between">
                  <span style={{ color: theme.colors.text.secondary }}>
                    Subtotal:
                  </span>
                  <span style={{ color: theme.colors.text.primary }}>
                    {formatPrice(
                      transformedOrder.gst?.hasGst 
                        ? transformedOrder.gst.subtotal 
                        : (transformedOrder.subtotalPriceV2?.amount || order?.subtotal_price || transformedOrder.totalPriceV2?.amount || order?.total_price || 0),
                      transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
                    )}
                  </span>
                </div>
                {transformedOrder.gst?.hasGst && transformedOrder.gst.gstPercentage > 0 ? (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.text.secondary }}>
                        GST ({transformedOrder.gst.gstPercentage}%):
                      </span>
                      <span style={{ color: theme.colors.text.primary }}>
                        {formatPrice(
                          transformedOrder.gst.gstAmount,
                          transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-base" style={{ borderColor: theme.colors.border.light }}>
                      <span style={{ color: theme.colors.text.primary }}>
                        Total (Including GST):
                      </span>
                      <span style={{ color: theme.colors.accent.primary }}>
                        {formatPrice(
                          transformedOrder.gst?.total || (parseFloat(transformedOrder.gst?.subtotal || 0) + parseFloat(transformedOrder.gst?.gstAmount || 0)) || transformedOrder.totalPriceV2?.amount || transformedOrder.total_price || order?.total_price || 0,
                          transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
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
                          transformedOrder.totalTaxV2?.amount || order?.total_tax || 0,
                          transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold text-base" style={{ borderColor: theme.colors.border.light }}>
                      <span style={{ color: theme.colors.text.primary }}>
                        Total:
                      </span>
                      <span style={{ color: theme.colors.accent.primary }}>
                        {formatPrice(
                          transformedOrder.totalPriceV2?.amount || transformedOrder.total_price || order?.total_price || 0,
                          transformedOrder.totalPriceV2?.currencyCode || transformedOrder.currency || order?.currency || "INR"
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            {transformedOrder.shippingAddress && (
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: theme.colors.text.primary }}>
                  <MapPin className="w-4 h-4" />
                  {TITLES.MY_ORDERS.SHIPPING_ADDRESS}
                </h3>
                <div className="text-sm space-y-1 p-4 rounded-md border" style={{ borderColor: theme.colors.border.light }}>
                  <p style={{ color: theme.colors.text.primary, fontWeight: "500" }}>
                    {transformedOrder.shippingAddress.name || `${transformedOrder.shippingAddress.first_name || ""} ${transformedOrder.shippingAddress.last_name || ""}`.trim() || "N/A"}
                  </p>
                  {transformedOrder.shippingAddress.address1 && <p style={{ color: theme.colors.text.secondary }}>{transformedOrder.shippingAddress.address1}</p>}
                  {transformedOrder.shippingAddress.address2 && <p style={{ color: theme.colors.text.secondary }}>{transformedOrder.shippingAddress.address2}</p>}
                  <p style={{ color: theme.colors.text.secondary }}>
                    {[transformedOrder.shippingAddress.city, transformedOrder.shippingAddress.province, transformedOrder.shippingAddress.zip].filter(Boolean).join(", ")}
                  </p>
                  {transformedOrder.shippingAddress.country && <p style={{ color: theme.colors.text.secondary }}>{transformedOrder.shippingAddress.country}</p>}
                  {transformedOrder.shippingAddress.phone && <p className="mt-2" style={{ color: theme.colors.text.secondary }}>📞 {transformedOrder.shippingAddress.phone}</p>}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <Package
              className="w-16 h-16 sm:w-20 sm:h-20 mb-4 opacity-50"
              style={{ color: theme.colors.text.secondary }}
            />
            <h2
              className="text-xl sm:text-2xl font-semibold mb-2"
              style={{ color: theme.colors.text.primary }}
            >
              Order not found
            </h2>
            <p
              className="text-sm sm:text-base text-center max-w-md"
              style={{ color: theme.colors.text.secondary }}
            >
              Unable to load order details. Please try again.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderModel;
