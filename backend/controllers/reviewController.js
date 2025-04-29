import reviewModel from '../models/reviewModal.js';
import appointmentModel from '../models/appointmentModel.js';
import doctorModel from '../models/doctorModel.js';

// Submit a new review
const submitReview = async (req, res) => {
  try {
    const { userId, doctorId, appointmentId, rating, reviewText } = req.body;

    if (!userId || !doctorId || !appointmentId || !rating) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    // Verify the appointment exists and belongs to the user
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.userId !== userId) {
      return res.json({ success: false, message: "You are not authorized to review this appointment" });
    }

    // Check if a review already exists for this appointment
    const existingReview = await reviewModel.findOne({ appointmentId });
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.reviewText = reviewText;
      await existingReview.save();
      
      // Update doctor's average rating
      await updateDoctorRating(doctorId);
      
      return res.json({ success: true, message: "Review updated successfully" });
    }

    // Create new review
    const reviewData = {
      userId,
      doctorId,
      appointmentId,
      rating,
      reviewText
    };

    const newReview = new reviewModel(reviewData);
    await newReview.save();

    // Update doctor's average rating
    await updateDoctorRating(doctorId);

    res.json({ success: true, message: "Review submitted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews for a doctor
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const reviews = await reviewModel.find({ doctorId }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get reviews by a user
const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.body;

    const reviews = await reviewModel.find({ userId }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Helper function to update doctor's average rating
const updateDoctorRating = async (doctorId) => {
  try {
    const reviews = await reviewModel.find({ doctorId });
    
    if (reviews.length === 0) return;
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    await doctorModel.findByIdAndUpdate(doctorId, { 
      rating: averageRating.toFixed(1),
      reviewCount: reviews.length
    });
  } catch (error) {
    console.log("Error updating doctor rating:", error);
  }
};

export { submitReview, getDoctorReviews, getUserReviews };