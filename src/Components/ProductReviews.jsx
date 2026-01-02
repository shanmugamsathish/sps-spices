import React, { useState, useEffect, useCallback } from 'react';
import { getProductReviews, submitProductReview } from '../apiCalls/reviews';
import { getCustomerOrdersWithProductIds } from '../apiCalls/orders';
import { getRelativeTime } from '../utils/dateUtils';
import toast from 'react-hot-toast';
import theme from '../lib/theme';

// Star Rating Display Component
const StarRating = ({ rating, size = 'w-5 h-5' }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={size}
          fill={star <= rating ? '#fbbf24' : '#e5e7eb'}
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

// Review Form Component
const ReviewForm = ({ productId, customerId, customerName, onReviewSubmitted }) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a review title');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    if (!customerId || !customerName) {
      toast.error('Customer information is required. Please log in.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitProductReview(productId, {
        customerId,
        customerName,
        rating: selectedRating,
        title: title.trim(),
        comment: comment.trim(),
      });

      if (response?.success) {
        toast.success(response.message || 'Review submitted successfully!');
        setTitle('');
        setComment('');
        setSelectedRating(0);
        setHoveredRating(0);
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        toast.error(response?.message || 'Failed to submit review');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit review';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="p-6 rounded-lg" style={{ backgroundColor: theme.colors.background.main, border: `1px solid ${theme.colors.border.light}` }}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: theme.colors.text.primary }}>
          Write a Review
        </h3>

        {/* Star Rating Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
            Rating *
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
              >
                <svg
                  className="w-8 h-8"
                  fill={(star <= selectedRating || star <= hoveredRating) ? '#fbbf24' : '#e5e7eb'}
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
            {selectedRating > 0 && (
              <span className="ml-2 text-sm" style={{ color: theme.colors.text.secondary }}>
                {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="review-title" className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
            Title *
          </label>
          <input
            id="review-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full px-4 py-2 rounded-md border focus:outline-none"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.accent.primary;
              e.target.style.boxShadow = `0 0 0 2px ${theme.colors.accent.primary}33`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border.light;
              e.target.style.boxShadow = 'none';
            }}
            maxLength={100}
            required
          />
        </div>

        {/* Comment Textarea */}
        <div className="mb-4">
          <label htmlFor="review-comment" className="block text-sm font-medium mb-2" style={{ color: theme.colors.text.primary }}>
            Your Review *
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product..."
            rows={5}
            className="w-full px-4 py-2 rounded-md border focus:outline-none resize-none"
            style={{
              backgroundColor: theme.colors.background.main,
              borderColor: theme.colors.border.light,
              color: theme.colors.text.primary,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = theme.colors.accent.primary;
              e.target.style.boxShadow = `0 0 0 2px ${theme.colors.accent.primary}33`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.colors.border.light;
              e.target.style.boxShadow = 'none';
            }}
            maxLength={1000}
            required
          />
          <p className="text-xs mt-1" style={{ color: theme.colors.text.secondary }}>
            {comment.length}/1000 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || selectedRating === 0 || !title.trim() || !comment.trim()}
          className="px-6 py-2 rounded-md font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: theme.colors.accent.primary,
            color: theme.colors.background.main,
          }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
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
      const response = await getCustomerOrdersWithProductIds();
      
      if (response?.success && response.orders) {
        const productIdsSet = new Set();
        
        response.orders.forEach((order) => {
          if (order.fulfillment_status === 'fulfilled') {
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
      console.error('Error fetching purchased products:', err);
      setHasPurchasedProduct(false);
    } finally {
      setIsCheckingPurchase(false);
    }
  }, [customerId, productId]);

  const fetchReviews = useCallback(async () => {
    if (!productId) {
      setIsLoading(false);
      setError('Product ID is required to load reviews');
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
        setError(response?.message || 'Failed to load reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load reviews';
      setError(errorMessage);
      setReviews([]);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="flex justify-center items-center">
          <div className="text-center" style={{ color: theme.colors.text.secondary }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: theme.colors.accent.primary }}></div>
            <p>Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.colors.text.primary }}>
        Customer Reviews
      </h2>

      {customerId && customerName && (
        <>
          {isCheckingPurchase ? (
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: theme.colors.background.main, border: `1px solid ${theme.colors.border.light}` }}>
              <p style={{ color: theme.colors.text.secondary }}>Checking purchase status...</p>
            </div>
          ) : !hasPurchasedProduct ? (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-blue-800 font-semibold">Review This Product</p>
              <p className="text-blue-700 mt-1 text-sm">
                You need to purchase and receive this product before you can write a review.
              </p>
            </div>
          ) : (
            <ReviewForm
              productId={productId}
              customerId={customerId}
              customerName={customerName}
              onReviewSubmitted={handleReviewSubmitted}
            />
          )}
        </>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-800 font-semibold">Error:</p>
          <p className="text-red-700 mt-1">{error}</p>
        </div>
      )}

      {!productId && !isLoading && (
        <div className="mb-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-800 font-semibold">Warning:</p>
          <p className="text-yellow-700 mt-1">Product ID is required to display reviews. Please provide a productId prop.</p>
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="text-center py-12 rounded-lg" style={{ backgroundColor: theme.colors.background.main, border: `1px solid ${theme.colors.border.light}` }}>
          <p style={{ color: theme.colors.text.secondary }}>
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-6 rounded-lg"
              style={{ backgroundColor: theme.colors.background.main, border: `1px solid ${theme.colors.border.light}` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold" style={{ color: theme.colors.text.primary }}>
                      {review.customer || 'Anonymous'}
                    </h4>
                    {review.verified && (
                      <span
                        className="px-2 py-1 text-xs font-semibold rounded-full"
                        style={{ backgroundColor: '#dcfce7', color: '#166534' }}
                      >
                        ✓ Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating rating={review.rating || 0} />
                    <span className="text-sm" style={{ color: theme.colors.text.secondary }}>
                      {getRelativeTime(review.date)}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && (
                <h5 className="text-base font-semibold mb-2" style={{ color: theme.colors.text.primary }}>
                  {review.title}
                </h5>
              )}

              {review.comment && (
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: theme.colors.text.secondary }}>
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductReviews;

