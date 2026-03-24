/**
 * Centralized API routes for the application.
 * Using a nested object structure for better organization.
 */
export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_EMAIL: "/auth/verify-email",
    SET_PASSWORD: "/auth/set-password",
    SOCIAL_LOGIN: "/auth/social",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    DELETE_ACCOUNT: "/auth/account",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
    RESEND_OTP: "/auth/resend-otp",
  },
  USER: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    CHECK_LOCATION: "/users/check-location",
  },
  CARS: {
    CREATE: "/cars",
    LIST: "/cars",
    SCAN_PHOTOS: "/cars/scan-photos",
    SCAN_LICENSE: "/cars/scan-license",
    MAKES: "/cars/makes",
    SEARCH: "/cars/search",
    MODELS: "/cars/models",
    TRIMS: "/cars/trims",
    DETAILS: "/cars/details",
    GET_BY_ID: (id: string) => `/cars/${id}`,
    UPDATE: (id: string) => `/cars/${id}`,
    DOCUMENTS: (carId: string) => `/cars/${carId}/documents`,
  },
  ACTIVITY: {
    TRIPS: "/activity/trips",
    REMINDERS: "/activity/reminders",
    SPENDS: "/activity/spends",
    INSIGHTS: "/activity/insights",
  },
  EXPENSES: {
    BASE: "/expenses",
    CATEGORIES: "/expenses/categories",
    VALUATION: (carId: string) => `/expenses/valuation/${carId}`,
    RECOMMEND_PRICE: "/expenses/recommend-price",
    DETAIL: (id: string) => `/expenses/${id}`,
    BY_CAR: (carId: string) => `/expenses/car/${carId}`,
  },
  TECHNICIANS: {
    BASE: "/technicians",
    DETAIL: (id: string) => `/technicians/${id}`,
  },
};

export type ApiRoutes = typeof API_ROUTES;
