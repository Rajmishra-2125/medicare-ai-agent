import api from "./api";

const createOrder = async (appointmentId) => {
  try {
    const response = await api.post("/payments/create-order", { appointmentId });
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
    const response = await api.post("/payments/verify", paymentData);
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
