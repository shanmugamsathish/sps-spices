import React from 'react'
import { ShoppingBag } from 'lucide-react';
import theme from '../../lib/theme';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../lib/constant';

function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-16">
    <ShoppingBag className="w-24 h-24 mb-4" style={{ color: theme.colors.text.secondary }} />
    <h2 className="text-2xl font-bold mb-2" style={{ color: theme.colors.text.primary }}>
      Your cart is empty
    </h2>
    <p className="mb-6" style={{ color: theme.colors.text.secondary }}>
      Add some products to get started
    </p>
    <button
      onClick={() => navigate(ROUTES.HOME)}
      className="px-6 py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
      style={{
        backgroundColor: theme.colors.accent.primary,
        color: theme.colors.background.main,
      }}
    >
      Continue Shopping
    </button>
  </div>
  )
}

export default EmptyCart
