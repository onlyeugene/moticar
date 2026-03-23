import apiClient from "@/config/apiClient";
import { API_ROUTES } from "@/config/apiRoutes";
import { AuthResponse, SignupResponse, User } from "@/types/auth";

/**
 * Auth Service
 * 
 * Groups all authentication-related API calls in one place.
 * These functions can be used inside React Query hooks (useQuery/useMutation).
 */
export const authService = {
  /** Register a new user and send OTP to email */
  signup: async (data: { email: string }): Promise<SignupResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.SIGNUP, data);
    return response.data;
  },

  /** Verify 5-digit OTP code sent to email */
  verifyEmail: async (data: { email: string; otp: string }): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.VERIFY_EMAIL, data);
    return response.data;
  },

  /** Set password after email verified */
  setPassword: async (data: { 
    email: string; 
    password: string; 
    otp: string;
    preferredCurrency?: string;
    country?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.SET_PASSWORD, data);
    return response.data;
  },

  /** Email + password login, returns JWT */
  login: async (data: { emailOrUsername: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGIN, data);
    return response.data;
  },

  /** Login or Signup via Google/Apple */
  socialLogin: async (data: { 
    email: string; 
    provider: string; 
    providerId: string; 
    name: string;
    preferredCurrency?: string;
    country?: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.SOCIAL_LOGIN, data);
    return response.data;
  },

  /** Refresh access token using refresh token */
  refreshToken: async (token: string): Promise<AuthResponse> => {
    const response = await apiClient.post(API_ROUTES.AUTH.REFRESH_TOKEN, { 
      token, 
      refreshToken: token 
    });
    return response.data;
  },

  /** Logout user */
  logout: async (): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    return response.data;
  },

  /** Delete user account */
  deleteAccount: async (): Promise<any> => {
    const response = await apiClient.delete(API_ROUTES.AUTH.DELETE_ACCOUNT);
    return response.data;
  },

  /** Request password reset OTP */
  forgotPassword: async (data: { email: string }): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.FORGOT_PASSWORD, data);
    return response.data;
  },

  /** Reset password using OTP */
  resetPassword: async (data: { email: string; otp: string; newPassword: string }): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.RESET_PASSWORD, data);
    return response.data;
  },

  /** Change password while logged in */
  changePassword: async (data: { oldPassword: string; newPassword: string }): Promise<any> => {
    const response = await apiClient.patch(API_ROUTES.AUTH.CHANGE_PASSWORD, data);
    return response.data;
  },

  /** Resend OTP for signup or forgot-password */
  resendOtp: async (data: { email: string; reason: string }): Promise<any> => {
    const response = await apiClient.post(API_ROUTES.AUTH.RESEND_OTP, data);
    return response.data;
  },
  
  /** Get current user profile */
  getMe: async (): Promise<User> => {
    const response = await apiClient.get(API_ROUTES.USER.PROFILE);
    return response.data.user;
  },

  /** Detect if user has traveled to a new country */
  checkLocation: async (ip?: string): Promise<any> => {
    const response = await apiClient.get(API_ROUTES.USER.CHECK_LOCATION, {
      params: { ip }
    });
    return response.data;
  },

  /** Update user profile */
  updateProfile: async (data: { 
    name?: string; 
    username?: string; 
    country?: string; 
    preferredCurrency?: string;
    preferredLanguage?: string;
  }): Promise<any> => {
    const response = await apiClient.patch(API_ROUTES.USER.PROFILE, data);
    return response.data;
  },
};
