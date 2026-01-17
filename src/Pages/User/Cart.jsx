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
import { ROUTES } from "../../lib/constant";
import { useNavigate } from "react-router-dom";
import { getGstPercentage } from "../../apiCalls/tax";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingLineId, setUpdatingLineId] = useState(null);
  const [gstPercentage, setGstPercentage] = useState(0);

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

  // Fetch GST percentage
  useEffect(() => {
    const fetchGst = async () => {
      try {
        const gstData = await getGstPercentage();
        if (gstData.success) {
          setGstPercentage(gstData.percentage || 0);
        }
      } catch (error) {
        console.error("Error fetching GST:", error);
      }
    };
    fetchGst();
  }, []);

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

  const findProductByVariantId = useCallback(
    (variantId) => {
      if (!variantId || !allProducts || allProducts.length === 0) return null;

      const extractNumericId = (id) => {
        if (!id) return null;
        if (typeof id === "number") return id;
        if (typeof id === "string") {
          const match = id.match(/\/(\d+)$/);
          return match ? parseInt(match[1], 10) : null;
        }
        return null;
      };

      const targetNumericId = extractNumericId(variantId);

      for (const product of allProducts) {
        if (product.variants && Array.isArray(product.variants)) {
          for (const variant of product.variants) {
            const variantGraphQLId = variant.admin_graphql_api_id;
            const variantNumericId = variant.id;

            if (variantGraphQLId === variantId) {
              return { product, variant };
            }

            if (targetNumericId && variantNumericId === targetNumericId) {
              return { product, variant };
            }

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

  const handleQuantityChange = async (lineId, currentQuantity, change) => {
    if (!cartId || !cart) return;

    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) {
      toast.error("Quantity cannot be less than 1. Use delete to remove item.");
      return;
    }

    try {
      setUpdatingLineId(lineId);
      const response = await updateItemQuantity({
        cartId: cartId, 
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

  const handleRemoveItem = async (lineId) => {
    if (!cartId || !cart) return;

    try {
      setUpdatingLineId(lineId);
      const response = await removeItemsFromCart({
        cartId: cartId, 
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

  // Calculate totals including GST
  const calculateTotals = () => {
    if (!cart || !cart.lines || !cart.lines.edges) {
      return { totalItems: 0, subtotal: 0, gstAmount: 0, total: 0 };
    }

    const totalItems = cart.lines.edges.reduce(
      (sum, edge) => sum + (edge.node.quantity || 0),
      0
    );

    const subtotal = parseFloat(cart.cost?.subtotalAmount?.amount || 0);
    const gstAmount = (subtotal * gstPercentage) / 100;
    const total = subtotal + gstAmount;

    return { 
      totalItems, 
      subtotal, 
      gstPercentage, 
      gstAmount: parseFloat(gstAmount.toFixed(2)), 
      total: parseFloat(total.toFixed(2)) 
    };
  };

  const { totalItems, subtotal, gstPercentage: gstPct, gstAmount, total } = calculateTotals();

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
          <OrderProducts
            cart={cart}
            findProductByVariantId={findProductByVariantId}
            handleQuantityChange={handleQuantityChange}
            handleRemoveItem={handleRemoveItem}
            updatingLineId={updatingLineId}
          />

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
                <div className="flex justify-between">
                  <span
                    className="font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    Subtotal:
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: theme.colors.text.primary }}
                  >
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                {gstPct > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: theme.colors.text.secondary }}>
                        GST ({gstPct}%):
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: theme.colors.text.primary }}
                      >
                        ₹{gstAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2" style={{ borderColor: theme.colors.border.light }}>
                      <div className="flex justify-between text-lg">
                        <span
                          className="font-bold"
                          style={{ color: theme.colors.text.primary }}
                        >
                          Total (Including GST):
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: theme.colors.text.primary }}
                        >
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
                {gstPct === 0 && (
                  <div className="flex justify-between text-lg">
                    <span
                      className="font-bold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      Total:
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: theme.colors.text.primary }}
                    >
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  navigate(ROUTES.PAYMENT);
                  toast.success("Redirecting to payment page...");
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
      <div >
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
