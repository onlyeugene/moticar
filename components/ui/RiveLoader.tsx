import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Platform, StyleProp, View, ViewStyle } from "react-native";
import { Asset } from "expo-asset";

type RiveModule = {
  default: React.ComponentType<any>;
  Fit?: Record<string, any>;
  Alignment?: Record<string, any>;
};

let riveModule: RiveModule | null = null;

try {
  riveModule = require("rive-react-native");
} catch (error) {
  console.warn("rive-react-native is unavailable", error);
}

export interface RiveLoaderProps {
  source?: number;
  resourceName?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  fit?: any;
  alignment?: any;
  style?: StyleProp<ViewStyle>;
  color?: string;
}

export const RiveLoader: React.FC<RiveLoaderProps> = ({
  source,
  resourceName,
  width = 72,
  height = 72,
  autoplay = true,
  fit,
  alignment,
  style,
  color = "#FBE74C",
}) => {
  const [iosUri, setIosUri] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function preloadRiveAsset() {
      if (Platform.OS !== "ios" || source == null) return;

      try {
        const asset = Asset.fromModule(source);
        await asset.downloadAsync();
        if (mounted) {
          setIosUri(asset.localUri ?? asset.uri);
        }
      } catch (error) {
        if (mounted) {
          setHasError(true);
        }
      }
    }

    preloadRiveAsset();

    return () => {
      mounted = false;
    };
  }, [source]);

  const Rive = useMemo(() => riveModule?.default ?? null, []);
  const resolvedFit = fit ?? riveModule?.Fit?.Contain;
  const resolvedAlignment = alignment ?? riveModule?.Alignment?.Center;

  const canRenderRive =
    !hasError &&
    Rive &&
    ((Platform.OS === "ios" && iosUri) || (Platform.OS === "android" && resourceName));

  if (!canRenderRive) {
    return (
      <View
        style={[
          { width, height, alignItems: "center", justifyContent: "center" },
          style,
        ]}
      >
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  return (
    <View
      style={[
        { width, height, overflow: "hidden", alignItems: "center", justifyContent: "center" },
        style,
      ]}
    >
      <Rive
        {...(Platform.OS === "ios" ? { url: iosUri } : { resourceName })}
        autoplay={autoplay}
        fit={resolvedFit}
        alignment={resolvedAlignment}
        style={{ width: "100%", height: "100%" }}
        onError={() => setHasError(true)}
      />
    </View>
  );
};
