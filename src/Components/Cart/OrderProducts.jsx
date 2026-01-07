import React from "react";
import theme from "../../lib/theme";
import { Loader2Icon, Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function OrderProducts({ cart, findProductByVariantId, handleQuantityChange, handleRemoveItem, updatingLineId }) {
  const navigate = useNavigate();
  const handleProductClick = (productId) => {
    navigate(`/product-details/${productId}`);
  };

  return (
    <div className="lg:col-span-2 space-y-4">
      {cart.lines.edges.map((edge) => {
        const lineItem = edge.node;
        const variantId = lineItem.merchandise?.id;
        const productData = findProductByVariantId(variantId);
        const product = productData?.product;
        const variant = productData?.variant;

      // Get product image
      const productImage = product?.image?.src || 
        (product?.images && product.images.length > 0 ? product.images[0].src : null);

        // Get variant details
        const variantTitle =
          lineItem.merchandise?.title || variant?.title || "N/A";
        const productTitle =
          product?.title || lineItem.merchandise?.title || "Product";
        const price = parseFloat(lineItem.merchandise?.priceV2?.amount || 0);
        const quantity = lineItem.quantity || 0;
        const lineTotal = price * quantity;

        // Check stock availability
        const stockQuantity =
          variant?.inventory_quantity !== undefined
            ? variant.inventory_quantity
            : null;
        const remainingStock =
          stockQuantity === null ? null : Math.max(0, stockQuantity - quantity);
        const isInStock = remainingStock === null || remainingStock > 0;
        const hasStockLimit = remainingStock !== null;

        const isUpdating = updatingLineId === lineItem.id;

        return (
          <div
            key={lineItem.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg border"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
            }}
          >
            {/* Column 1: Product Image */}
            <div className="flex justify-center md:justify-start">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productTitle}
                  className="w-32 h-32 object-cover rounded-md cursor-pointer"
                  style={{ border: `1px solid ${theme.colors.border.light}` }}
                  onClick={() => handleProductClick(product.id)}
                />
              ) : (
                <div
                  className="w-32 h-32 flex flex-col items-center justify-center rounded-md"
                  style={{
                    backgroundColor: theme.colors.border.light,
                    border: `1px solid ${theme.colors.border.light}`,
                  }}
                >
                  <div className="w-32 h-32 flex flex-col items-center justify-center">
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Loading...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Column 2: Product Details */}
            <div className="flex flex-col gap-3">
              <div>
                <h3
                  className="text-lg font-semibold mb-1 cursor-pointer"
                  style={{ color: theme.colors.text.primary }}
                  onClick={() => handleProductClick(product.id)}
                >
                  {productTitle}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {variantTitle}
                </p>
              </div>

              {/* Stock Status */}
              <div>
                <span
                  className={`text-sm font-medium ${
                    isInStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isInStock ? "In Stock" : "Out of Stock"}
                </span>
                {hasStockLimit && (
                  <span
                    className="text-xs ml-2"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    ({remainingStock} available)
                  </span>
                )}
                {stockQuantity === null && (
                  <span
                    className="text-xs ml-2"
                    style={{ color: theme.colors.text.secondary }}
                  >
                    (Stock info unavailable)
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleQuantityChange(lineItem.id, quantity, -1)
                  }
                  disabled={isUpdating || quantity <= 1}
                  className="p-1 rounded-md hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span
                  className="px-4 py-1 rounded-md font-semibold min-w-[50px] text-center"
                  style={{
                    backgroundColor: theme.colors.background.main,
                    border: `1px solid ${theme.colors.border.light}`,
                    color: theme.colors.text.primary,
                  }}
                >
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(lineItem.id, quantity, 1)}
                  disabled={
                    isUpdating ||
                    (hasStockLimit && remainingStock <= 0) ||
                    stockQuantity === 0
                  }
                  className="p-1 rounded-md hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme.colors.accent.primary,
                    color: theme.colors.background.main,
                  }}
                  title={
                    isUpdating
                      ? "Updating..."
                      : stockQuantity === 0
                      ? "Out of stock"
                      : hasStockLimit && remainingStock <= 0
                      ? "Maximum quantity reached"
                      : "Increase quantity"
                  }
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleRemoveItem(lineItem.id)}
                disabled={isUpdating}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-fit"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>

            {/* Column 3: Price (on mobile, this appears below) */}
            <div className="flex flex-col justify-between md:text-right">
              <div>
                <p
                  className="text-sm mb-1"
                  style={{ color: theme.colors.text.secondary }}
                >
                  Price: ₹{price.toFixed(2)}
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: theme.colors.text.primary }}
                >
                  ₹{lineTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderProducts;
