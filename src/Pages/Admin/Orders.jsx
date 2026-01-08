import React, { useState, useEffect, useCallback } from 'react'
import { getAdminOrders } from '../../apiCalls/orders'
import theme from '../../lib/theme'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setLoading } from '../../redux/loaderSlice'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loadingText, setLoadingText] = useState(true)
  const dispatch = useDispatch()

  const fetchOrders = useCallback(async () => {
    try {
      setLoadingText(true)
      dispatch(setLoading(true))
      const response = await getAdminOrders()
      setOrders(response?.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoadingText(false)
      dispatch(setLoading(false))
    }
  }, [dispatch])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  // Format order ID
  const getOrderId = (order) => {
    return order.name || `#${order.order_number || order.id}`
  }

  // Format customer name
  const getCustomerName = (order) => {
    if (order.customer) {
      const firstName = order.customer.first_name || ''
      const lastName = order.customer.last_name || ''
      const name = `${firstName} ${lastName}`.trim()
      return name || order.customer.email || order.email || 'N/A'
    }
    return order.email || 'N/A'
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '₹0.00'
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return '₹0.00'
    return `₹${numAmount.toFixed(2)}`
  }

  // Get delivery method
  const getDeliveryMethod = (order) => {
    if (order.shipping_lines && order.shipping_lines.length > 0) {
      return order.shipping_lines[0].title || 'Standard Shipping'
    }
    return 'Standard Shipping'
  }

  // Handle cancel (no functionality needed for now)
  // const handleCancel = (orderId) => {
  //   console.log('Cancel order:', orderId)
  //   // TODO: Implement cancel functionality
  // }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: theme.colors.text.primary }}
        >
          Orders
        </h1>
      </div>

      {orders.length === 0 && !loadingText ? (
        <div
          className="p-8 text-center rounded-lg"
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${theme.colors.border.light}`,
          }}
        >
          <p style={{ color: theme.colors.text.secondary }}>
            No orders found.
          </p>
        </div>
      ) : (
        <div
          className="rounded-lg overflow-hidden shadow-sm"
          style={{
            backgroundColor: '#FFFFFF',
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
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Fulfillment Status
                  </th>
                  <th
                    className="px-4 py-3 text-left text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Delivery Method
                  </th>
                  {/* <th
                    className="px-4 py-3 text-center text-sm font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Actions
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 transition-colors"
                    style={{
                      borderBottom:
                        index < orders.length - 1
                          ? `1px solid ${theme.colors.border.light}`
                          : 'none',
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
                        className="font-medium"
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
                    <td className="px-4 py-3 text-center">
                      <span
                        className="font-medium"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {order.fulfillment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ color: theme.colors.text.secondary }}>
                        {getDeliveryMethod(order)}
                      </span>
                    </td>
                    {/* <td className="px-4 py-3">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => handleCancel(order.id)}
                          className="p-1 rounded-md text-white text-sm transition-colors cursor-pointer" style={{backgroundColor: theme.colors.accent.primary}}
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders