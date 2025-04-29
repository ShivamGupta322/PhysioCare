import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  appointmentId: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per appointment
reviewSchema.index({ appointmentId: 1 }, { unique: true });

const reviewModel = mongoose.model('Review', reviewSchema);

export default reviewModel;