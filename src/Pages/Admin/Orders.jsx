import React, { useState, useEffect, useCallback } from "react";
import { getAdminOrders } from "../../apiCalls/orders";
import theme from "../../lib/theme";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loaderSlice";
import { fulfillOrder } from "../../apiCalls/orders";
import DialogBox from "../../components/DialogBox";
import { CheckCircle, EyeIcon, DownloadIcon } from "lucide-react";
import OrderModel from "../../Components/OrderModel";
import { useDownloadPDF } from "../../hooks/useDownloadPDF";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [orderModelOpen, setOrderModelOpen] = useState(false);
  const [loadingText, setLoadingText] = useState(true);
  const dispatch = useDispatch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState("unfulfilled");
  const { handleDownloadPDF } = useDownloadPDF(setIsGeneratingPDF);

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingText(true);
      dispatch(setLoading(true));
      const response = await getAdminOrders();
      setOrders(response?.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoadingText(false);
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Format order ID
  const getOrderId = (order) => {
    return order.name || `#${order.order_number || order.id}`;
  };

  // Format customer name
  const getCustomerName = (order) => {
    if (order.customer) {
      const firstName = order.customer.first_name || "";
      const lastName = order.customer.last_name || "";
      const name = `${firstName} ${lastName}`.trim();
      return name || order.customer.email || order.email || "N/A";
    }
    return order.email || "N/A";
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return "₹0.00";
    return `₹${numAmount.toFixed(2)}`;
  };

  // Get delivery method
  const getDeliveryMethod = (order) => {
    if (order.shipping_lines && order.shipping_lines.length > 0) {
      return order.shipping_lines[0].title || "Standard Shipping";
    }
    return "Standard Shipping";
  };

  // Handle cancel (no functionality needed for now)
  // const handleCancel = (orderId) => {
  //   console.log('Cancel order:', orderId)
  //   // TODO: Implement cancel functionality
  // }

  // Handle fulfill
  const handleFulfill = async (orderId) => {
    try {
      dispatch(setLoading(true));
      const response = await fulfillOrder(orderId);
      if (response.success) {
        toast.success("Order dispatched successfully");
        setIsDialogOpen(false);
        fetchOrders();
      } else {
        toast.error("Failed to dispatch order");
      }
    } catch (error) {
      console.error("Error dispatching order:", error);
      toast.error("Failed to dispatch order");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDialogOpen = (orderId) => {
    setIsDialogOpen(true);
    setSelectedOrder(orderId);
  };

  const handleOrderModelOpen = (orderId) => {
    setOrderModelOpen(true);
    setSelectedOrder(orderId);
  };

  const handleOrderModelClose = () => {
    setOrderModelOpen(false);
  };

  const handleDownloadClick = (orderId) => {
    handleDownloadPDF(orderId);
  };

  // Filter and sort orders based on fulfillment status
  const getFilteredAndSortedOrders = () => {
    const fulfilledOrders = orders.filter(
      (order) => order.fulfillment_status === "fulfilled"
    );
    const unfulfilledOrders = orders.filter(
      (order) => !order.fulfillment_status || order.fulfillment_status === null
    );

    // Sort unfulfilled: old to recent (ascending by created_at)
    const sortedUnfulfilled = [...unfulfilledOrders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB;
    });

    // Sort fulfilled: recent to old (descending by created_at)
    const sortedFulfilled = [...fulfilledOrders].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateB - dateA;
    });

    return {
      fulfilled: sortedFulfilled,
      unfulfilled: sortedUnfulfilled,
    };
  };

  const { fulfilled, unfulfilled } = getFilteredAndSortedOrders();
  const displayedOrders = activeTab === "fulfilled" ? fulfilled : unfulfilled;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Orders
        </h1>
        <p className="text-sm text-gray-500">
          Download the invoice PDF for shipment purposes.
        </p>
      </div>

      {/* Tabs */}
      <div
        className="mb-6 flex gap-1 border-b"
        style={{ borderColor: theme.colors.border.light }}
      >
        {[
          {
            key: "unfulfilled",
            label: "Unfulfilled",
            count: unfulfilled.length,
          },
          { key: "fulfilled", label: "Fulfilled", count: fulfilled.length },
        ].map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 font-semibold text-sm transition-all duration-200 relative rounded-t-lg ${
                isActive
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              style={{
                backgroundColor: isActive
                  ? theme.colors.accent.primary
                  : "transparent",
                borderBottom: isActive
                  ? `3px solid ${theme.colors.accent.primary}`
                  : "3px solid transparent",
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.25)"
                      : theme.colors.background.main,
                    color: isActive ? "white" : theme.colors.text.primary,
                  }}
                >
                  {tab.count}
                </span>
              )}

              {/* Animated underline */}
              {isActive && (
                <span
                  className="absolute left-0 bottom-0 w-full h-[3px]"
                  style={{ backgroundColor: theme.colors.accent.primary }}
                />
              )}
            </button>
          );
        })}
      </div>

      {displayedOrders.length === 0 && !loadingText ? (
        <div
          className="p-8 text-center rounded-lg"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <p style={{ color: theme.colors.text.secondary }}>
            No {activeTab === "fulfilled" ? "fulfilled" : "unfulfilled"} orders
            found.
          </p>
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden shadow-sm"
          style={{
            backgroundColor: "#FFFFFF",
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  style={{
                    backgroundColor: theme.colors.background.main,
                    borderBottom: `2px solid ${theme.colors.border.light}`,
                  }}
                >
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Order ID
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Customer
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Order Date
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Total
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Status
                  </th>
                  {/* <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Fulfillment Status
                  </th> */}
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Delivery Method
                  </th>
                  <th
                    className="px-4 py-3 text-center text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{
                      borderBottom:
                        index < displayedOrders.length - 1
                          ? `1px solid ${theme.colors.border.light}`
                          : "none",
                    }}
                  >
                    <td className="px-4 py-3">
                      <span
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {getOrderId(order)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-medium line-clamp-1"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {getCustomerName(order)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: theme.colors.text.secondary }}>
                        {formatDate(order.created_at)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {formatCurrency(order.total_price)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {order.financial_status}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3 text-center">
                      <span
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {order.fulfillment_status}
                      </span>
                    </td> */}
                    <td className="px-4 py-3">
                      <span style={{ color: theme.colors.text.secondary }}>
                        {getDeliveryMethod(order)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {/* Eye Button */}
                        <div className="w-10 flex justify-center">
                          <button
                            onClick={() => handleOrderModelOpen(order.id)}
                            className="p-1 rounded-full text-sm transition-colors cursor-pointer"
                            title="View Order"
                            style={{
                              backgroundColor:
                                order.fulfillment_status === "fulfilled"
                                  ? "green"
                                  : theme.colors.accent.primary,
                            }}
                          >
                            <EyeIcon className="w-5 h-5 text-white" />
                          </button>
                        </div>
                        <div className="w-10 flex justify-center">
                          <button
                            onClick={() => handleDownloadClick(order.id)}
                            disabled={isGeneratingPDF}
                            className="p-1 rounded-full text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            title={
                              isGeneratingPDF
                                ? "Generating PDF..."
                                : "Download Invoice"
                            }
                            style={{
                              backgroundColor:
                                order.fulfillment_status === "fulfilled"
                                  ? "green"
                                  : theme.colors.accent.primary,
                            }}
                          >
                            <DownloadIcon className="w-5 h-5 text-white" />
                          </button>
                        </div>
                        {/* Status / Action */}
                        <div className="w-24 flex justify-center">
                          {order.fulfillment_status === "fulfilled" ? (
                            <span className="text-green-700 flex items-center gap-2">
                              <CheckCircle className="w-5 h-5 animate-pulse" />
                              Fulfilled
                            </span>
                          ) : (
                            <button
                              onClick={() => handleDialogOpen(order.id)}
                              className="p-2 rounded-md text-white text-sm transition-colors cursor-pointer"
                              style={{
                                backgroundColor: theme.colors.accent.primary,
                              }}
                              title="Dispatch Order"
                            >
                              Dispatch
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <DialogBox
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="Dispatch Order"
        description="Once you dispatch this order, it will be marked as fulfilled and the customer will be able to leave a review. Do you want to confirm?"
        onConfirm={() => handleFulfill(selectedOrder)}
      />
      <OrderModel
        isOpen={orderModelOpen}
        onClose={handleOrderModelClose}
        orderId={selectedOrder}
        isAdmin={true}
      />
    </div>
  );
}

export default Orders;
