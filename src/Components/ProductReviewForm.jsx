import React, { useState } from 'react'
import toast from 'react-hot-toast';
import theme from '../lib/theme';
import { submitProductReview } from '../apiCalls/reviews';

function ProductReviewForm({ productId, customerId, customerName, onReviewSubmitted }) {
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
          <div 
            className="p-6 sm:p-8 rounded-lg transition-all duration-300" 
            style={{ 
              backgroundColor: theme.colors.background.main, 
              border: `1px solid ${theme.colors.border.light}`,
              boxShadow: "0 2px 8px rgba(79, 53, 33, 0.08)",
            }}
          >
            <h3 
              className="text-xl font-semibold mb-6 pb-3 border-b" 
              style={{ 
                color: theme.colors.text.primary,
                borderColor: theme.colors.border.light
              }}
            >
              Write a Review
            </h3>
    
            {/* Star Rating Selection */}
            <div className="mb-6">
              <label 
                className="block text-sm font-medium mb-3" 
                style={{ color: theme.colors.text.primary }}
              >
                Rating *
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
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
                  <span 
                    className="ml-3 text-sm font-medium" 
                    style={{ color: theme.colors.text.secondary }}
                  >
                    {selectedRating} {selectedRating === 1 ? 'star' : 'stars'}
                  </span>
                )}
              </div>
            </div>
    
            {/* Title Input */}
            <div className="mb-6">
              <label 
                htmlFor="review-title" 
                className="block text-sm font-medium mb-2" 
                style={{ color: theme.colors.text.primary }}
              >
                Title *
              </label>
              <input
                id="review-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your review a title"
                className="w-full px-4 py-3 rounded-md border focus:outline-none transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.accent.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.accent.primary}33`;
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
            <div className="mb-6">
              <label 
                htmlFor="review-comment" 
                className="block text-sm font-medium mb-2" 
                style={{ color: theme.colors.text.primary }}
              >
                Your Review *
              </label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={6}
                className="w-full px-4 py-3 rounded-md border focus:outline-none resize-none transition-all"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: theme.colors.border.light,
                  color: theme.colors.text.primary,
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.colors.accent.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${theme.colors.accent.primary}33`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.colors.border.light;
                  e.target.style.boxShadow = 'none';
                }}
                maxLength={1000}
                required
              />
              <p 
                className="text-xs mt-2 text-right" 
                style={{ color: theme.colors.text.secondary }}
              >
                {comment.length}/1000 characters
              </p>
            </div>
    
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || selectedRating === 0 || !title.trim() || !comment.trim()}
              className="px-8 py-3 rounded-md font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
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
}

export default ProductReviewForm
