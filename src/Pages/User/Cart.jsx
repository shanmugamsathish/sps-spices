import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import theme from "../../lib/theme";
import { selectCart } from "../../redux/productSlice";
import { updateInventoryFromCart, setCart } from "../../redux/productSlice";
import { getCartDetails, updateItemQuantity, removeItemsFromCart } from "../../apiCalls/cart";
import EmptyCart from "../../Components/Cart/EmptyCart";
import { getAllProducts } from "../../apiCalls/products";
import OrderProducts from "../../Components/Cart/OrderProducts";
import RecentProducts from "../User/RecentProducts";

function Cart() {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState(null);

  // Get cartId from localStorage
  const cartId = localStorage.getItem("cartId");

  const fetchProducts = useCallback(async () => {
    try {
      const products = await getAllProducts();
      setAllProducts(products);
    } catch (error) {
      toast.error(`${error.message || "Error fetching products"}`);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Fetch cart if not in Redux
  useEffect(() => {
    const fetchCart = async () => {
      if (!cart && cartId) {
        try {
          setLoading(true);
          const response = await getCartDetails(cartId);
          if (response?.success && response.cart) {
            dispatch(setCart(response.cart));
            dispatch(updateInventoryFromCart(response.cart));
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchCart();
  }, [cart, cartId, dispatch]);

  // Helper to find product by variant ID
  const findProductByVariantId = useCallback(
    (variantId) => {
      if (!variantId || !allProducts || allProducts.length === 0) return null;

      // Extract numeric ID from GraphQL ID if needed
      const extractNumericId = (id) => {
        if (!id) return null;
        if (typeof id === "number") return id;
        if (typeof id === "string") {
          // Handle GraphQL ID format: "gid://shopify/ProductVariant/51060196966688"
          const match = id.match(/\/(\d+)$/);
          return match ? parseInt(match[1], 10) : null;
        }
        return null;
      };

      const targetNumericId = extractNumericId(variantId);

      for (const product of allProducts) {
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            // Try multiple matching strategies
            const variantGraphQLId = variant.admin_graphql_api_id;
            const variantNumericId = variant.id;

            // Match by GraphQL ID
            if (variantGraphQLId === variantId) {
              return { product, variant };
            }

            // Match by numeric ID
            if (targetNumericId && variantNumericId === targetNumericId) {
              return { product, variant };
            }

            // Match by constructed GraphQL ID
            if (variantNumericId) {
              const constructedGraphQLId = `gid://shopify/ProductVariant/${variantNumericId}`;
              if (constructedGraphQLId === variantId) {
                return { product, variant };
              }
            }
          }
        }
      }
      return null;
    },
    [allProducts]
  );

  // Update quantity
  const handleQuantityChange = async (lineId, currentQuantity, change) => {
    if (!cartId || !cart) return;

    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1. Use delete to remove item.");
      return;
    }

    try {
      setUpdatingLineId(lineId);
      // Use full cartId (with key) for API call - Shopify requires it
      const response = await updateItemQuantity({
        cartId: cartId, // Use full cartId with key
        lines: [
          {
            id: lineId,
            quantity: newQuantity,
          },
        ],
      });

      if (response?.success && response.cart) {
        dispatch(setCart(response.cart));
        dispatch(updateInventoryFromCart(response.cart));
        toast.success("Cart updated successfully");
      } else {
        toast.error(
          response?.errors?.[0]?.message || "Failed to update quantity"
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Error updating quantity");
    } finally {
      setUpdatingLineId(null);
    }
  };

  // Remove item
  const handleRemoveItem = async (lineId) => {
    if (!cartId || !cart) return;

    try {
      setUpdatingLineId(lineId);
      // Use full cartId (with key) for API call
      const response = await removeItemsFromCart({
        cartId: cartId, // Use full cartId with key
        lineIds: [lineId],
      });

      if (response?.success && response.cart) {
        dispatch(setCart(response.cart));
        dispatch(updateInventoryFromCart(response.cart));
        toast.success("Item removed from cart");
      } else {
        toast.error(response?.errors?.[0]?.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Error removing item");
    } finally {
      setUpdatingLineId(null);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!cart || !cart.lines || !cart.lines.edges) {
      return { totalItems: 0, subtotal: 0 };
    }

    const totalItems = cart.lines.edges.reduce(
      (sum, edge) => sum + (edge.node.quantity || 0),
      0
    );

    const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || 0);

    return { totalItems, subtotal };
  };

  const { totalItems, subtotal } = calculateTotals();

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <p style={{ color: theme.colors.text.primary }}>Loading cart...</p>
      </div>
    );
  }

  if (
    !cart ||
    !cart.lines ||
    !cart.lines.edges ||
    cart.lines.edges.length === 0
  ) {
    return (
      <div
        className="min-h-screen py-8 px-4"
        style={{ backgroundColor: theme.colors.background.main }}
      >
        <div className="container mx-auto max-w-7xl">
          <EmptyCart />
          <div className="my-4">
            <h2
              className="font-bold mb-4 sm:ml-8 md:ml-12 lg:ml-16 text-xl sm:text-2xl md:text-3xl lg:text-3xl leading-tight"
              style={{ color: theme.colors.text.primary }}
            >
              Products You May Like
            </h2>
            <RecentProducts productsData={allProducts} />
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <h1
          className="text-3xl font-bold mb-8"
          style={{ color: theme.colors.text.primary }}
        >
          Shopping Cart
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items - Takes 2 columns on large screens */}
          <OrderProducts
            cart={cart}
            findProductByVariantId={findProductByVariantId}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
            updatingLineId={updatingLineId}
          />

          {/* Column 3: Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="sticky top-4 p-6 rounded-lg border"
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
                    Total Items:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    {totalItems}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span
                    className="font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Subtotal:
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  // Navigate to checkout page when implemented
                  toast.info("Checkout page coming soon!");
                  // navigate('/checkout');
                }}
                className="glow-button w-full py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: theme.colors.accent.primary,
                  color: theme.colors.background.main,
                }}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className=" my-4">
        <h2
          className="font-bold mb-4 sm:ml-8 md:ml-12 lg:ml-16 text-xl sm:text-2xl md:text-3xl lg:text-3xl leading-tight"
          style={{ color: theme.colors.text.primary }}
        >
          Products You May Like
        </h2>{" "}
        <RecentProducts productsData={allProducts} />
      </div>
    </div>
  );
}
export default Cart;
