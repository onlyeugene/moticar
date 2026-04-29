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
    SET_NAME: "/auth/set-name",
    CHECK_LOCATION_PUBLIC: "/auth/check-location",
  },
  USER: {
    ME: "/users/me",
    PROFILE: "/users/profile",
    CHECK_LOCATION: "/users/check-location",
    PUSH_TOKEN: "/users/push-token",
    EMAIL_NOTIFICATIONS: "/users/email-notifications",
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
    DOCUMENTS_LIST: (carId: string) => `/cars/${carId}/documents/list`,
    DOCUMENTS_MANUAL: (carId: string) => `/cars/${carId}/documents/manual`,
    DOCUMENTS_DETAIL: (carId: string, docId: string) => `/cars/${carId}/documents/${docId}`,
    DELETE: (id: string) => `/cars/${id}`,
    SCAN_DOCUMENT: "/cars/scan-document",
  },

  ACTIVITY: {
    TRIPS: "/activity/trips",
    REMINDERS: "/activity/reminders",
    SPENDS: "/activity/spends",
    INSIGHTS: "/activity/insights",
    MILESTONES: "/activity/milestones",
  },

  EXPENSES: {
    BASE: "/expenses",
    CATEGORIES: "/expenses/categories",
    SCAN_RECEIPT: "/expenses/scan-receipt",
    UPLOAD_RECEIPT: "/expenses/upload",
    VALUATION: (carId: string) => `/expenses/valuation/${carId}`,
    RECOMMEND_PRICE: "/expenses/recommend-price",
    DETAIL: (id: string) => `/expenses/${id}`,
    BY_CAR: (carId: string) => `/expenses/car/${carId}`,
  },
  TECHNICIANS: {
    BASE: "/technicians",
    DETAIL: (id: string) => `/technicians/${id}`,
    UPDATE: (id: string) => `/technicians/${id}`,
  },
  OBD: {
    PAIR: "/obd/pair",
    LINK_DEVICE: "/obd/link-device",
    ENABLE: "/obd/enable",
    STATUS: (deviceId: string) => `/obd/device/${deviceId}/status`,
    DIAGNOSTIC: (carId: string) => `/obd/car/${carId}/diagnostic`,
    ACTIVATE: (carId: string) => `/obd/car/${carId}/activate`,
    COMMAND: "/obd/command",
  },
  NOTIFICATIONS: {
    BASE: "/notifications",
    REGISTER_TOKEN: "/notifications/register-token",
    MARK_AS_READ: (notificationId: string) => `/notifications/${notificationId}/read`,
    MARK_ALL_AS_READ: "/notifications/mark-all-read",
  },
  INSURANCE: {
    PROVIDERS: (countryCode: string) => `/insurance/providers/${countryCode}`,
  },
};

export type ApiRoutes = typeof API_ROUTES;
