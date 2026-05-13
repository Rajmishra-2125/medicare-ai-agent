import api from "./api";

// Add a new review
const addReview = async (reviewData) => {
  const response = await api.post("/reviews/add", reviewData);
  return response.data;
};

// Get reviews for a specific doctor
const getDoctorReviews = async (doctorId, page = 1, limit = 10) => {
  const response = await api.get(`/reviews/${doctorId}?page=${page}&limit=${limit}`);
  return response.data;
};

const reviewService = {
  addReview,
  getDoctorReviews,
};

export default reviewService;
