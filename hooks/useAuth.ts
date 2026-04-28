import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/api/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useAppStore } from "@/store/useAppStore";
import { AuthResponse, SignupResponse, User, UpdateProfilePayload } from "@/types/auth";
import { router } from "expo-router";
import * as Localization from "expo-localization";
import { CURRENCIES, LANGUAGES } from "@/utils/currency";

const getDefaultPreferences = (user: Partial<User> | null) => {
  const deviceLocales = Localization.getLocales();
  const deviceCurrency = deviceLocales[0]?.currencyCode;
  const deviceLanguageTag = deviceLocales[0]?.languageTag;
  const deviceLanguageCode = deviceLocales[0]?.languageCode;

  const resolvedLang =
    LANGUAGES.find((l) => l.value === user?.preferredLanguage) ||
    LANGUAGES.find((l) => l.value === deviceLanguageTag) ||
    LANGUAGES.find((l) => l.value.startsWith(deviceLanguageCode || "en")) ||
    LANGUAGES.find((l) => l.value === "en-GB") ||
    LANGUAGES[0];

  const resolvedCurr =
    CURRENCIES.find((c) => c.value === user?.preferredCurrency) ||
    CURRENCIES.find((c) => c.value === deviceCurrency) ||
    CURRENCIES.find((c) => c.value === "USD") ||
    CURRENCIES[0];

  return {
    preferredLanguage: resolvedLang.value,
    preferredCurrency: resolvedCurr.value,
    country: resolvedCurr.country,
  };
};

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
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: (data: { 
      email: string; 
      password: string; 
      otp: string;
      preferredCurrency?: string;
      preferredLanguage?: string;
      country?: string;
      deviceType?: string;
      hasManuallySetPreferences?: boolean;
    }) => {
      const defaults = getDefaultPreferences(user);
      const payload = {
        ...data,
        preferredLanguage: data.preferredLanguage || defaults.preferredLanguage,
        preferredCurrency: data.preferredCurrency || defaults.preferredCurrency,
        country: data.country || defaults.country,
      };
      return authService.setPassword(payload);
    },
  });
};

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const clearAppState = useAppStore((state) => state.clearAppState);
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: (data: { emailOrUsername: string; password: string; deviceType?: string, preferredLanguage?: string, preferredCurrency?: string, country?: string, hasManuallySetPreferences?: boolean }) => {
      const defaults = getDefaultPreferences(user);
      const payload = {
        ...data,
        preferredLanguage: data.preferredLanguage || defaults.preferredLanguage,
        preferredCurrency: data.preferredCurrency || defaults.preferredCurrency,
        country: data.country || defaults.country,
      };
      return authService.login(payload);
    },
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
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: (data: { 
      email: string; 
      provider: string; 
      providerId: string; 
      name: string;
      preferredCurrency?: string;
      preferredLanguage?: string;
      country?: string;
      deviceType?: string;
      idToken?: string;
      hasManuallySetPreferences?: boolean;
    }) => {
      const defaults = getDefaultPreferences(user);
      const payload = {
        ...data,
        preferredLanguage: data.preferredLanguage || defaults.preferredLanguage,
        preferredCurrency: data.preferredCurrency || defaults.preferredCurrency,
        country: data.country || defaults.country,
      };
      return authService.socialLogin(payload);
    },
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

export const useCheckLocationPublic = (ip?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["user", "location", "public", ip],
    queryFn: () => authService.checkLocationPublic(ip),
    enabled,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => authService.updateProfile(data),
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
      
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["cars"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["activity"] });
      
      // Specifically refetch the main profile query
      queryClient.refetchQueries({ queryKey: ["user", "me"] });
    },
    onError: (error) => {
      console.error("❌ [useUpdateProfile] Error:", error);
    }
  });
};



export const useSetName = () => {
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: (data: { email: string; name: string; preferredName?: string; preferredCurrency?: string; preferredLanguage?: string; country?: string, hasManuallySetPreferences?: boolean }) => {
      const defaults = getDefaultPreferences(user);
      const payload = {
        ...data,
        preferredLanguage: data.preferredLanguage || defaults.preferredLanguage,
        preferredCurrency: data.preferredCurrency || defaults.preferredCurrency,
        country: data.country || defaults.country,
      };
      return authService.setName(payload);
    },
  });
};

export const useToggleEmailNotifications = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  return useMutation({
    mutationFn: authService.toggleEmailNotifications,
    onSuccess: (data) => {
      if (typeof data.emailNotificationsEnabled === "boolean") {
        updateUser({ emailNotificationsEnabled: data.emailNotificationsEnabled });
      }
      queryClient.invalidateQueries({ queryKey: ["user", "me"]});
    }
  });
};