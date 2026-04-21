import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCheckLocationPublic } from "@/hooks/useAuth";
import * as Location from "expo-location";
import { CURRENCIES, LANGUAGES } from "@/utils/currency";

/**
 * PreferenceInitializer
 * 
 * A background component that detects the user's location/currency 
 * for unauthenticated users if they haven't manually selected one yet.
 * Now supports GPS detection with an explicit permission request.
 */
export function PreferenceInitializer() {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [gpsAttempted, setGpsAttempted] = useState(false);

  // Only run if user is unauthenticated and hasn't manually set preferences
  const canDetect = !token && !user?.hasManuallySetPreferences;
  
  // Use IP detection as a fallback query
  const { data: ipData, isSuccess: ipSuccess } = useCheckLocationPublic(
    undefined, 
    canDetect && !user?.preferredCurrency && !gpsAttempted
  );

  useEffect(() => {
    async function detectGPS() {
      if (!canDetect || gpsAttempted) return;

      try {
        console.log("📍 [PreferenceInitializer] Requesting GPS permissions...");
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });

          if (address?.isoCountryCode) {
            const isoCode = address.isoCountryCode.toUpperCase();
            console.log(`🌍 [PreferenceInitializer] GPS detected country: ${isoCode}`);
            
            const matchedCurrency = CURRENCIES.find(c => c.isoCode === isoCode);
            // Simple mapping for languages based on region
            const matchedLang = 
              LANGUAGES.find(l => l.value.includes(isoCode)) || 
              (isoCode === "NG" ? LANGUAGES[0] : null);

            if (matchedCurrency) {
              updateUser({
                country: matchedCurrency.country,
                preferredCurrency: matchedCurrency.value,
                ...(matchedLang ? { preferredLanguage: matchedLang.value } : {}),
              });
              setGpsAttempted(true);
              return;
            }
          }
        }
      } catch (err) {
        console.error("📍 GPS Detection Error:", err);
      } finally {
        setGpsAttempted(true);
      }
    }

    detectGPS();
  }, [canDetect, gpsAttempted, updateUser]);

  // Fallback to IP detection if GPS isn't used or fails to find a currency
  useEffect(() => {
    if (canDetect && !user?.preferredCurrency && ipSuccess && ipData) {
      console.log("☁️ [PreferenceInitializer] Falling back to IP detection:", ipData);
      updateUser({
        country: ipData.countryCode,
        preferredCurrency: ipData.currencyCode,
      });
    }
  }, [canDetect, user?.preferredCurrency, ipSuccess, ipData, updateUser]);

  return null;
}
