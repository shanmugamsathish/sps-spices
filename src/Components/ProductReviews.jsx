import React, { useState, useEffect, useCallback } from "react";
import { getProductReviews, deleteProductReview } from "../apiCalls/reviews";
import { getCustomerOrdersWithProductIds } from "../apiCalls/orders";
import { getRelativeTime } from "../utils/dateUtils";
import theme from "../lib/theme";
import { setLoading } from "../redux/loaderSlice";
import ProductReviewForm from "./ProductReviewForm";
import { Loader2Icon, TrashIcon } from "lucide-react";
import toast from "react-hot-toast";

// Star Rating Display Component
const StarRating = ({ rating, size = "w-5 h-5" }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={size}
          fill={star <= rating ? "#fbbf24" : "#e5e7eb"}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};
// Main Product Reviews Component
function ProductReviews({ productId, customerId, customerName }) {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCheckingPurchase, setIsCheckingPurchase] = useState(false);
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);

  const fetchPurchasedProducts = useCallback(async () => {
    if (!customerId) {
      setHasPurchasedProduct(false);
      return;
    }

    setIsCheckingPurchase(true);
    try {
      setLoading(true);
      const response = await getCustomerOrdersWithProductIds();

      if (response?.success && response.orders) {
        const productIdsSet = new Set();

        response.orders.forEach((order) => {
          if (order.fulfillment_status === "fulfilled") {
            if (order.line_items && Array.isArray(order.line_items)) {
              order.line_items.forEach((item) => {
                if (item.product_id) {
                  productIdsSet.add(String(item.product_id));
                }
              });
            } else if (order.lineItems?.edges) {
              order.lineItems.edges.forEach((edge) => {
                const item = edge.node;
                if (item.product_id) {
                  productIdsSet.add(String(item.product_id));
                }
              });
            }
          }
        });

        if (productId) {
          const productIdStr = String(productId);
          setHasPurchasedProduct(productIdsSet.has(productIdStr));
        }
      }
    } catch (err) {
      console.error("Error fetching purchased products:", err);
      setHasPurchasedProduct(false);
    } finally {
      setIsCheckingPurchase(false);
      setLoading(false);
    }
  }, [customerId, productId]);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      setError("Product ID is required to load reviews");
      setReviews([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductReviews(productId);
      if (response?.success) {
        setReviews(response.reviews || []);
      } else {
        setError(response?.message || "Failed to load reviews");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to load reviews";
      setError(errorMessage);
      setReviews([]);
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  useEffect(() => {
    fetchPurchasedProducts();
  }, [fetchPurchasedProducts]);

  const handleReviewSubmitted = useCallback(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDeleteReview = useCallback(
    async (reviewId) => {
      try {
        setLoading(true);
        const response = await deleteProductReview(productId, reviewId);
        if (response?.success) {
          toast.success("Review deleted successfully");
          fetchReviews();
        } else {
          toast.error(response?.message || "Failed to delete review");
        }
      } catch (error) {
        console.error("Error deleting review:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete review"
        );
      } finally {
        setLoading(false);
      }
    },
    [productId, fetchReviews]
  );

  if (isLoading) {
    return (
      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
          <div
            className="text-center p-6 rounded-lg "
            style={{
              color: theme.colors.text.secondary,
              backgroundColor: theme.colors.background.main,
            }}
          >
            <div className="w-32 h-32 flex flex-col items-center justify-center">
              <Loader2Icon className="w-8 h-8 animate-spin" />
              <p className="text-sm">Loading reviews...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        className="text-2xl sm:text-3xl font-bold mb-6 pb-3 border-b"
        style={{
          color: theme.colors.text.primary,
          borderColor: theme.colors.border.light,
        }}
      >
        Customer Reviews
      </h2>
      {reviews.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{
            backgroundColor: theme.colors.background.main,
            border: `1px solid ${theme.colors.border.light}`,
            boxShadow: "0 2px 8px rgba(79, 53, 33, 0.08)",
          }}
        >
          <p
            className="text-base"
            style={{ color: theme.colors.text.secondary }}
          >
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 rounded-lg transition-all duration-300 hover:shadow-lg"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: "0 2px 8px rgba(79, 53, 33, 0.08)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h4
                        className="text-lg font-semibold"
                        style={{ color: theme.colors.text.primary }}
                      >
                        {review.customer || "Anonymous"}
                      </h4>
                      {review.verified && (
                        <span
                          className="px-2.5 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: "#dcfce7",
                            color: "#166534",
                          }}
                        >
                          ✓ Verified Purchase
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      className="p-1.5 rounded-md hover:bg-red-50 transition-colors"
                      style={{ color: "#EF4444" }}
                      aria-label="Delete review"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <StarRating rating={review.rating || 0} />
                    <span
                      className="text-sm"
                      style={{ color: theme.colors.text.secondary }}
                    >
                      {getRelativeTime(review.date)}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h5
                  className="text-base font-semibold mb-3"
                  style={{ color: theme.colors.text.primary }}
                >
                  {review.title}
                </h5>
              )}

              {review.comment && (
                <p
                  className="text-sm leading-relaxed whitespace-pre-wrap"
                  style={{ color: theme.colors.text.secondary }}
                >
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <h2
        className="text-2xl sm:text-3xl font-bold my-6 pb-3 border-b"
        style={{
          color: theme.colors.text.primary,
          borderColor: theme.colors.border.light,
        }}
      >
        Submit a Review
      </h2>
      {customerId && customerName && (
        <>
          {isCheckingPurchase ? (
            <div
              className="mb-6 p-4 rounded-lg"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: "0 2px 8px rgba(79, 53, 33, 0.08)",
              }}
            >
              <p style={{ color: theme.colors.text.secondary }}>
                Checking purchase status...
              </p>
            </div>
          ) : !hasPurchasedProduct ? (
            <div
              className="mb-6 p-6 rounded-lg flex flex-col items-center justify-center gap-4"
              style={{
                backgroundColor: theme.colors.background.main,
                border: `1px solid ${theme.colors.border.light}`,
                boxShadow: "0 2px 8px rgba(79, 53, 33, 0.08)",
              }}
            >
              <p
                className="text-lg font-semibold"
                style={{ color: theme.colors.text.primary }}
              >
                Review This Product
              </p>
              <p
                className="text-sm text-center"
                style={{ color: theme.colors.text.secondary }}
              >
                You need to purchase and receive this product before you can
                write a review.
              </p>
            </div>
          ) : (
            <ProductReviewForm
              productId={productId}
              customerId={customerId}
              customerName={customerName}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}
        </>
      )}

      {error && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: "#FEE2E2",
            borderColor: "#FCA5A5",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: "#DC2626" }}>
            Error:
          </p>
          <p style={{ color: "#991B1B" }}>{error}</p>
        </div>
      )}

      {!productId && !isLoading && (
        <div
          className="mb-6 p-4 rounded-lg border"
          style={{
            backgroundColor: "#FEF3C7",
            borderColor: "#FCD34D",
          }}
        >
          <p className="font-semibold mb-1" style={{ color: "#92400E" }}>
            Warning:
          </p>
          <p style={{ color: "#78350F" }}>
            Product ID is required to display reviews. Please provide a
            productId prop.
          </p>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
