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
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// 4. Request Interceptor (Crucial for Cross-Domain Auth)
// Attaches the accessToken from localStorage to every request.
// This ensures authentication works even if the browser blocks third-party cookies (e.g. Safari, Incognito).
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
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
        // Use the configured api instance (has auth header) + send refreshToken from
        // localStorage as body fallback for when cross-domain cookies are blocked.
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await api.post(
          `/auth/refresh-token`,
          refreshToken ? { refreshToken } : {}
        );

        // Update the stored accessToken so future requests use the new one
        if (data?.data?.accessToken) {
          localStorage.setItem("accessToken", data.data.accessToken);
        }
        if (data?.data?.refreshToken) {
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }

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
