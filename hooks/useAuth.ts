import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { AuthResponse, SignupResponse, User } from "@/types/auth";
import { router } from "expo-router";

/**
 * Authentication Hooks
 * 
 * Provides React Query mutations for all auth actions.
 */

export const useSignup = () => {
  return useMutation({
    mutationFn: authService.signup,
  });
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: authService.verifyEmail,
  });
};

export const useSetPassword = () => {
  return useMutation({
    mutationFn: (data: { 
      email: string; 
      password: string; 
      otp: string;
      preferredCurrency?: string;
      country?: string;
    }) => authService.setPassword(data),
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAppState = useAppStore((state) => state.clearAppState);
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      if (data.token && data.refreshToken && data.user) {
        clearAppState();
        setAuth(data.token, data.refreshToken, data.user);
      }
    },
  });
};

export const useSocialLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAppState = useAppStore((state) => state.clearAppState);
  return useMutation({
    mutationFn: (data: { 
      email: string; 
      provider: string; 
      providerId: string; 
      name: string;
      preferredCurrency?: string;
      country?: string;
    }) => authService.socialLogin(data),
    onSuccess: (data) => {
      if (data.token && data.refreshToken && data.user) {
        clearAppState();
        setAuth(data.token, data.refreshToken, data.user);
      }
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearAppState = useAppStore((state) => state.clearAppState);
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      // Clear store and cache on logout
      clearAuth();
      clearAppState();
      queryClient.clear();
      router.replace("/(auth)/welcome");
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const clearAppState = useAppStore((state) => state.clearAppState);
  return useMutation({
    mutationFn: authService.deleteAccount,
    onSuccess: () => {
      // Clear store and cache on deletion
      clearAuth();
      clearAppState();
      queryClient.clear();
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authService.forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authService.resetPassword,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: authService.changePassword,
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: authService.resendOtp,
  });
};

export const useMe = (enabled: boolean = true) => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const query = useQuery({
    queryKey: ["user", "me"],
    queryFn: authService.getMe,
    enabled,
  });

  useEffect(() => {
    if (query.data) {
      updateUser(query.data);
    }
  }, [query.data, updateUser]);

  return query;
};

export const useCheckLocation = (ip?: string) => {
  return useQuery({
    queryKey: ["user", "location", ip],
    queryFn: () => authService.checkLocation(ip),
    enabled: true,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: { 
      name?: string; 
      username?: string; 
      country?: string; 
      preferredCurrency?: string;
      preferredLanguage?: string;
      onboardingCompleted?: boolean;
    }) => authService.updateProfile(data),
    onSuccess: (data, variables) => {
      console.log("🔄 [useUpdateProfile] Success:", { data, variables });
      
      // If the response contains the updated user, use it.
      // Otherwise, merge variables into the store.
      if (data?.user) {
        updateUser(data.user);
      } else if (data && typeof data === 'object' && !data.message && Object.keys(data).length > 2) {
        updateUser(data);
      } else {
        // Fallback to updating with variables send in the request
        console.log("🔄 [useUpdateProfile] Falling back to request variables for store update");
        updateUser(variables);
      }
      
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
      queryClient.invalidateQueries({ queryKey: ["user", "me", "profile"] });
      queryClient.invalidateQueries({ queryKey: ["cars", "user"] });
    },
    onError: (error) => {
      console.error("❌ [useUpdateProfile] Error:", error);
    }
  });
};



export const useSetName = () => {
  return useMutation({
    mutationFn: authService.setName,
  });
};