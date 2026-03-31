import { getBrandLogo } from "@/utils/brandIcons";
import { Text, View } from "react-native";

export function BrandTags({
  brands,
  width,
  height,
  size,
}: {
  brands: string[];
  width?: number;
  height?: number;
  size?: "small" | "large";
}) {
  if (!brands || brands.length === 0) return null;

  // Determine dimensions based on props or size
  const isSmall = size === "small";
  const finalWidth = width || (isSmall ? 32 : 48);
  const finalHeight = height || (isSmall ? 8 : 12);
  const fontSize = isSmall ? 7 : 8;
  return (
    <View className="flex-row gap-2 flex-wrap items-center">
      {brands.slice().map((brand) => {
        // Fuzzy matching: "Mobil 1" -> "mobil", "TotalEnergies" -> "total"
        const cleanName = brand
          .toLowerCase()
          .split(" ")[0]
          .replace("energies", "");
        const Logo = getBrandLogo(cleanName);

        if (Logo) {
          return (
            <View key={brand} className="">
              <Logo width={finalWidth} height={finalHeight} />
            </View>
          );
        }

        return (
          <View key={brand} className="">
            <Text
              style={{ fontSize }}
              className="font-lexendBold text-black uppercase"
            >
              {brand}
            </Text>
          </View>
        );
      })}
    </View>
  );
}