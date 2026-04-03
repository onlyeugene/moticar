import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Hook to detect if the device is offline or internet is unreachable.
 * @returns {boolean} isOffline
 */
export function useIsOffline() {
  const [isOffline, setOffline] = useState(false);

  useEffect(() => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      // isConnected: false means the network is completely down.
      // isInternetReachable: false means we're connected to a network but have no actual internet.
      const offline = state.isConnected === false || state.isInternetReachable === false;
      setOffline(offline);
    });

    return () => removeNetInfoSubscription();
  }, []);

  return isOffline;
}
