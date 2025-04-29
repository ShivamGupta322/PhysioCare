import express from 'express';
import { submitReview, getDoctorReviews, getUserReviews } from '../controllers/reviewController.js';
import authUser from '../middlewares/authUser.js';


const router = express.Router();

// Submit a review
router.post('/submit', authUser, submitReview);

// Get reviews for a doctor
router.get('/doctor/:doctorId', getDoctorReviews);

// Get reviews by a user
router.get('/user', authUser, getUserReviews);

export default router;