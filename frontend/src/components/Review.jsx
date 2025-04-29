import React, { useState, useContext } from 'react';
import { Star } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const Review = ({ doctorId, appointmentId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { backendUrl, token } = useContext(AppContext);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setSubmitting(true);
    setError('');
    
    try {
      // Make API call to submit review
      const response = await axios.post(`${backendUrl}/api/reviews/submit`, {
        doctorId,
        appointmentId,
        rating,
        reviewText
      }, {
        headers: { token }
      });
      
      if (response.data.success) {
        setSubmitted(true);
        // Reset form after successful submission
        setTimeout(() => {
          setRating(0);
          setReviewText('');
          setSubmitted(false);
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      setError('An error occurred while submitting your review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Feedback</h2>
      <div className="space-y-6">
        {/* Star Rating */}
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">How would you rate your experience?</p>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-colors"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-none text-gray-300'
                  } transition-colors`}
                />
              </button>
            ))}
            <span className="ml-2 text-gray-600">{rating > 0 ? `${rating}/5` : ""}</span>
          </div>
        </div>
        
        {/* Review Text */}
        <div className="space-y-2">
          <p className="text-gray-700 font-medium">Your comments (optional)</p>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with the doctor and the treatment plan..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className={`px-6 py-2 rounded-lg font-medium text-white ${
              rating === 0 ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
            style={{ backgroundColor: rating > 0 ? '#5F6FFF' : undefined }}
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
        
        {/* Success Message */}
        {submitted && (
          <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
            Thank you for your feedback! Your review has been submitted successfully.
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;