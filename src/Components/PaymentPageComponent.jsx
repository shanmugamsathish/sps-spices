import React from 'react'
import theme from '../lib/theme'

function PaymentPageComponent({ cartTotal, error, loading, handlePayment }) {
  return (
    <div className="container mx-auto max-w-2xl">
    <h1
      className="text-3xl font-bold mb-8"
      style={{ color: theme.colors.text.primary }}
    >
      Payment
    </h1>

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
        <div className="flex justify-between">
          <span style={{ color: theme.colors.text.secondary }}>
            Subtotal:
          </span>
          <span
            className="font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            ₹{cartTotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-lg pt-3 border-t"
             style={{ borderColor: theme.colors.border.light }}>
          <span
            className="font-bold"
            style={{ color: theme.colors.text.primary }}
          >
            Total:
          </span>
          <span
            className="font-bold text-xl"
            style={{ color: theme.colors.accent.primary }}
          >
            ₹{cartTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <div
          className="mb-4 p-3 rounded-md"
          style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
        >
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || cartTotal <= 0}
        className="glow-button w-full py-3 rounded-md font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: theme.colors.accent.primary,
          color: theme.colors.background.main,
        }}
      >
        {loading ? "Processing..." : "Proceed to Pay"}
      </button>
    </div>

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
