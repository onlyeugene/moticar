import axios, { InternalAxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { useAuthStore } from "@/store/useAuthStore";
import { API_ROUTES } from "@/config/apiRoutes";

// Variable to track if we're currently refreshing the token
let isRefreshing = false;
// Queue to hold requests that failed with 401 while refreshing
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const safeStringify = (data: any) => {
  try {
    return JSON.stringify(data, null, 2);
  } catch (e) {
    return "[Circular or Non-Serializable Data]";
  }
};

/**
 * Axios client configuration.
 * Uses EXPO_PUBLIC_API_URL environment variable as the base URL.
 */
const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://api.moticar.com/v1",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 🟢 Retrieve token directly from Zustand state
    const token = useAuthStore.getState().token;

    // 🟢 Debug log for development
    if (__DEV__) {
      const params = config.params ? `?${new URLSearchParams(config.params).toString()}` : "";
      console.log(
        `🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}${params}`,
        {
          hasToken: !!token,
          hasAuthHeader: !!config.headers.Authorization,
          data: config.data ? safeStringify(config.data) : ""
        }
      );
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    if (__DEV__) {
      console.error(`❌ [API Request Error]`, error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 🟢 Debug log for development
    if (__DEV__) {
      console.log(
        `✅ [API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        safeStringify(response.data)
      );
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // 🔴 Debug log for development
    if (__DEV__) {
      console.error(
        `🔴 [API Response Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
        safeStringify(error.response?.data || error.message)
      );
    }

    // 🔴 Handle unauthorized errors (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = useAuthStore.getState().refreshToken;

      if (!refreshToken) {
        isRefreshing = false;
        useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      try {
        // 🟡 Attempt to refresh the token
        const refreshUrl = `${apiClient.defaults.baseURL}${API_ROUTES.AUTH.REFRESH_TOKEN}`;
        if (__DEV__) {
          console.log(`🟡 [Auth Refresh] Attempting refresh at: ${refreshUrl}`);
        }

        const response = await axios.post(refreshUrl, {
          token: refreshToken, // Backend specifically expects 'token' field
        });

        if (__DEV__) {
          console.log(
            `🟢 [Auth Refresh Success]`,
            safeStringify(response.data)
          );
        }

        const { 
          token: newToken, 
          accessToken, 
          access_token, 
          refreshToken: newRefreshToken, 
          user 
        } = response.data;

        // Backend might return token, accessToken, or access_token
        const finalToken = newToken || accessToken || access_token;

        if (!finalToken) {
          throw new Error("No access token received from refresh endpoint");
        }

        // 🟢 Update the store
        useAuthStore.getState().setAuth(finalToken, newRefreshToken || refreshToken, user);

        // 🟢 Process the queue and retry original request
        processQueue(null, finalToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${finalToken}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // 🔴 Refresh failed (likely refresh token expired too)
        processQueue(refreshError, null);
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
