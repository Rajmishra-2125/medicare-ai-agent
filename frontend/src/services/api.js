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
  
  // Trigger cross-tab logout synchronization
  window.localStorage.setItem('logoutEvent', Date.now().toString());

  // Check if we are on a protected route
  const protectedRoutes = ['/admin', '/doctor', '/patient'];
  const isProtected = protectedRoutes.some(route => window.location.pathname.startsWith(route));

  if (isProtected && window.location.pathname !== '/login') {
    window.location.href = '/login';
  } else if (window.location.pathname !== '/login') {
    // If we're on a public page, just reload to let Redux catch the logged-out state
    window.location.reload();
  }
};

// 4. Request Interceptor (Crucial for Cross-Domain Auth)
// Tries to send access token via Authorization header as a robust fallback for cross-site cookie blocking.
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
        const refreshToken = localStorage.getItem("refreshToken");
        // Pass the refreshToken in request body as a robust fallback if cookie is blocked
        const res = await api.post(`/auth/refresh-token`, { refreshToken });

        if (res.data?.data?.accessToken) {
          localStorage.setItem("accessToken", res.data.data.accessToken);
          if (res.data.data.refreshToken) {
            localStorage.setItem("refreshToken", res.data.data.refreshToken);
          }
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
