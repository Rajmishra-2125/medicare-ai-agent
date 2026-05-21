import api from "./api";
import { cacheManager } from "../utils/cacheManager";

// Get current doctor's profile
const getDoctorDetails = async () => {
    const response = await api.get("/doctors/my-profile");
    return response.data.data;
}

// Update doctor details
const updateDoctorDetails = async (doctorData) => {
    const response = await api.patch("/doctors/updateInfo", doctorData);
    if (response.data) {
      // Update the doctor info in user object in localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (currentUser) {
        currentUser.doctorInfo = response.data.data;
        localStorage.setItem("user", JSON.stringify(currentUser));
      }
    }
}

const getDoctorsProfiles = async () => {
    const CACHE_KEY = "all_doctors_profiles";
    const cachedData = cacheManager.get(CACHE_KEY);
    
    if (cachedData) {
      // Stale-while-revalidate: Return cached data immediately, then fetch new data in background
      api.get("/doctors/profiles").then(response => {
        if (response.data?.data) {
          cacheManager.set(CACHE_KEY, response.data.data, 10 * 60 * 1000);
        }
      }).catch(() => {}); // ignore bg errors
      
      return cachedData;
    }

    const response = await api.get("/doctors/profiles");
    if (response.data?.data) {
      cacheManager.set(CACHE_KEY, response.data.data, 10 * 60 * 1000); // 10 minutes cache
    }
    return response.data.data || [];
}

// Alias for backwards compatibility
const getAllDoctors = getDoctorsProfiles;


const docotrService = {
  getDoctorDetails,
  updateDoctorDetails,
  getDoctorsProfiles,
  getAllDoctors, // Add the new function
};

export default docotrService;