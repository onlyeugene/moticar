import { Platform } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import { useSocialLogin } from "./useAuth";

let GoogleSignin: any = {
  configure: () => {},
  hasPlayServices: async () => {},
  signIn: async () => ({}),
};
let statusCodes: any = {};

try {
  // We use require inside a try-catch to prevent a hard crash in Expo Go
  const GoogleModule = require("@react-native-google-signin/google-signin");
  GoogleSignin = GoogleModule.GoogleSignin;
  statusCodes = GoogleModule.statusCodes;

  GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB || "PLACEHOLDER_WEB_ID",
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS || "PLACEHOLDER_IOS_ID",
  });
} catch (e) {
  console.warn("⚠️ Google Sign-in native module not found. Skipping initialization for Expo Go.");
}

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
        deviceType: Platform.OS.toLowerCase(),
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

  const loginWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo: any = await GoogleSignin.signIn();
      
      // Handle v12/v13 structure change
      const idToken = userInfo?.data?.idToken || userInfo?.idToken;
      const userDetails = userInfo?.data?.user || userInfo?.user;
      
      if (idToken) {
        handleSocialAuthSuccess("google", idToken, userDetails);
      }
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation in progress
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.error("Play services not available or outdated");
      } else {
        console.error("Google Auth Error:", error);
      }
    }
  };

  return {
    loginWithApple,
    loginWithGoogle,
    isPending: socialLogin.isPending,
  };
};
