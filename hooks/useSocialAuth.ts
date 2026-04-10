import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useSocialLogin } from "./useAuth";
import { useEffect } from "react";

// Required for Google Auth Session
WebBrowser.maybeCompleteAuthSession();

/**
 * useSocialAuth Hook
 * 
 * Provides functions to trigger native Google and Apple authentication flows.
 * Returns the social token and user info to be sent to the backend.
 */
export const useSocialAuth = (callbacks?: { 
  onSuccess?: (data: any) => void; 
  onError?: (error: any) => void;
}) => {
  const socialLogin = useSocialLogin();

  // 1. Google Auth Configuration
  // Note: These IDs should ideally be in env variables
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || "PLACEHOLDER_IOS_ID",
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID || "PLACEHOLDER_ANDROID_ID",
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || "PLACEHOLDER_WEB_ID",
  });

  // Handle Google Response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      if (authentication?.idToken) {
        // We use the idToken for backend verification
        handleSocialAuthSuccess("google", authentication.idToken);
      }
    }
  }, [response]);

  const decodeIdToken = (token: string) => {
    try {
      const parts = token.split(".");
      if (parts.length < 2) return {};
      
      // Manual base64 decode for React Native (avoiding Buffer)
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("JWT Decode Error:", e);
      return {};
    }
  };

  const handleSocialAuthSuccess = async (provider: "google" | "apple", idToken: string, extraData?: any) => {
    try {
      const decoded = decodeIdToken(idToken);
      const email = extraData?.email || decoded.email;
      
      let name = "Social User";
      if (extraData?.fullName) {
        const { givenName, familyName } = extraData.fullName;
        if (givenName || familyName) {
          name = `${givenName || ""} ${familyName || ""}`.trim();
        }
      } else if (decoded.name) {
        name = decoded.name;
      } else if (email) {
        const prefix = email.split("@")[0];
        name = prefix.charAt(0).toUpperCase() + prefix.slice(1);
      }

      const providerId = extraData?.user || decoded.sub;

      if (!email || !providerId) {
        throw new Error("Unable to retrieve necessary account identifiers from provider.");
      }

      socialLogin.mutate({
        email, 
        provider,
        providerId, 
        name,
        idToken,
      } as any, {
        onSuccess: (data) => {
          if (callbacks?.onSuccess) callbacks.onSuccess(data);
        },
        onError: (error) => {
          if (callbacks?.onError) callbacks.onError(error);
        }
      });
    } catch (error) {
      console.error(`Social Auth Logic Error (${provider}):`, error);
    }
  };

  const loginWithApple = async () => {
    try {
      if (Platform.OS === 'android') {
        console.warn("Apple login not supported on Android currently");
        return;
      }

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (credential.identityToken) {
        handleSocialAuthSuccess("apple", credential.identityToken, credential);
      }
    } catch (e: any) {
      if (e.code === "ERR_CANCELED") {
        // User cancelled the login flow
      } else {
        console.error("Apple Auth Error:", e);
      }
    }
  };

  const loginWithGoogle = () => {
    promptAsync();
  };

  return {
    loginWithApple,
    loginWithGoogle,
    isPending: socialLogin.isPending,
    googleRequest: request,
  };
};
