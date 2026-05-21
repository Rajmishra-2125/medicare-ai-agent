import axios from 'axios';
import toast from 'react-hot-toast';

// 1. Environment variables
// Automatically falls back to localhost if env variable is surprisingly missing
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://medicare-healthcare-app.onrender.com/api/v1',
  // 4. Secure cookies - instructs Axios to securely attach HttpOnly cookies to every outgoing request
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 3. Logout helper function
// Keeps session clearing logic in one clean, exported module
export const forceLogout = () => {
  localStorage.removeItem("user");
  // Tokens are in HttpOnly cookies, so we can't remove them here. 
  // We should ideally call the /auth/logout endpoint, but if we are here we might already be 401.
  
  // Trigger cross-tab logout synchronization
  window.localStorage.setItem('logoutEvent', Date.now().toString());

  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// 4. Request Interceptor (Crucial for Cross-Domain Auth)
// Since we are using HttpOnly cookies, we do not need to attach Authorization headers from localStorage.
// withCredentials: true ensures the cookies are sent automatically.
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    
    // 2. Network error handling
    // Triggers if the server is offline, CORS blocks the request, or internet is disconnected.
    if (!error.response) {
      if (!window.navigator.onLine) {
        toast.error("No internet connection available.");
      } else {
        toast.error("Network Error - Server unreachable. Please try again later.");
      }
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 5. Refresh token rotation
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh-token') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Since we use HttpOnly cookies, we just call the endpoint. 
        // The browser will automatically attach the refreshToken cookie.
        await api.post(`/auth/refresh-token`, {});

        // Note: The backend will set new cookies in the response headers.
        // We no longer need to save them to localStorage.

        isRefreshing = false;
        processQueue(null, true);

        // Replay the original request now that the token is refreshed
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        isRefreshing = false;

        // Refresh failed, token is genuinely dead. Safely boot them out.
        forceLogout();
        return Promise.reject(err);
      }
    }

    // Default 401 error handling catching edge cases / unauthorized access
    if (error.response.status === 401) {
        const message = error.response.data?.message;
        console.error("401 ERROR CAUGHT IN INTERCEPTOR:", message, "URL:", originalRequest.url);
        if (
          message === "Invalid access token" ||
          message === "Unauthorized" ||
          message === "Invalid acess token" ||
          message === "Token expired"
        ) {
          console.error("FORCING LOGOUT due to:", message);
          forceLogout();
        }
    }

    return Promise.reject(error);
  }
);

export default api;
