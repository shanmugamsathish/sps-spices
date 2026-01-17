import React from 'react'
import theme from '../lib/theme'

function PaymentPageComponent({ 
  cartTotal, 
  cartItemsCount,
  error, 
  loading, 
  handlePayment,
  isFormValid,
  gstPercentage = 0,
  gstAmount = 0,
}) {
  // Shipping cost (hardcoded to 0)
  const shippingCost = 0;
  const subtotal = cartTotal;
  const total = subtotal + gstAmount + shippingCost;

  return (
    <div className="w-full">
      {/* Order Summary Card */}
      <div
        className="p-6 rounded-lg border mb-6"
        style={{
          backgroundColor: theme.colors.background.main,
          borderColor: theme.colors.border.light,
        }}
      >
        <h2
          className="text-xl font-bold mb-4"
          style={{ color: theme.colors.text.primary }}
        >
          Order Summary
        </h2>

        <div className="space-y-3 mb-6">
          {/* Item Count */}
          <div className="flex justify-between">
            <span style={{ color: theme.colors.text.secondary }}>
              Items ({cartItemsCount}):
            </span>
            <span
              className="font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              {cartItemsCount} {cartItemsCount === 1 ? 'item' : 'items'}
            </span>
          </div>

          {/* Subtotal */}
          <div className="flex justify-between">
            <span style={{ color: theme.colors.text.secondary }}>
              Subtotal:
            </span>
            <span
              className="font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              ₹{subtotal.toFixed(2)}
            </span>
          </div>

          {/* GST */}
          {gstPercentage > 0 && (
            <div className="flex justify-between">
              <span style={{ color: theme.colors.text.secondary }}>
                GST ({gstPercentage}%):
              </span>
              <span
                className="font-semibold"
                style={{ color: theme.colors.text.primary }}
              >
                ₹{gstAmount.toFixed(2)}
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between">
            <span style={{ color: theme.colors.text.secondary }}>
              Shipping:
            </span>
            <span
              className="font-semibold"
              style={{ color: theme.colors.text.primary }}
            >
              {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
            </span>
          </div>

          {/* Total */}
          <div className="flex justify-between text-lg pt-3 border-t"
               style={{ borderColor: theme.colors.border.light }}>
            <span
              className="font-bold"
              style={{ color: theme.colors.text.primary }}
            >
              {gstPercentage > 0 ? 'Total (Including GST):' : 'Total:'}
            </span>
            <span
              className="font-bold text-xl"
              style={{ color: theme.colors.accent.primary }}
            >
              ₹{total.toFixed(2)}
            </span>
          </div>

          {/* Estimated Delivery */}
          <div className="pt-3 border-t"
               style={{ borderColor: theme.colors.border.light }}>
            <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
              <strong>Estimated Delivery:</strong> 3-5 business days
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-4 p-3 rounded-md"
            style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
          >
            {error}
          </div>
        )}

        {/* Proceed to Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading || cartTotal <= 0 || !isFormValid}
          className="glow-button w-full py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.main,
          }}
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>

        {/* Form Validation Hint */}
        {!isFormValid && cartTotal > 0 && (
          <p className="mt-2 text-sm text-center" style={{ color: "#DC2626" }}>
            Please fill in all required address fields
          </p>
        )}
      </div>

      {/* Security Notice */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: theme.colors.background.main,
          borderColor: theme.colors.border.light,
        }}
      >
        <p className="text-sm" style={{ color: theme.colors.text.secondary }}>
          <strong>Secure Payment:</strong> Your payment is processed securely
          through Razorpay. We do not store your payment information.
        </p>
      </div>
    </div>
  )
}

export default PaymentPageComponent
