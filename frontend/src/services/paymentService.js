import axios from "axios";

// Update BASE_URL mapping to match your environment variables or local setup
const BASE_URL = import.meta.env.VITE_API_URL || "https://medicare-healthcare-app.onrender.com/api/v1";

const createOrder = async (appointmentId) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payments/create-order`,
      { appointmentId },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/payments/verify`,
      paymentData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    }
    throw error;
  }
};

const paymentService = {
  createOrder,
  verifyPayment,
};

export default paymentService;
