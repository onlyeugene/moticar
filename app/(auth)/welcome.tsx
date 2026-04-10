import LogoIcon from "@/assets/images/logowhite.svg";
import { useSocialLogin } from "@/hooks/useAuth";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SocialAuthButtons } from "../../components/ui/SocialAuthButtons";

// Character SVGs
import Img1 from "@/assets/images/image.svg";
import Img2 from "@/assets/images/image1.svg";
import Img3 from "@/assets/images/image2.svg";
import Img4 from "@/assets/images/image3.svg";
import Img5 from "@/assets/images/image4.svg";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    Image: Img1,
    bgImage: require("@/assets/images/onboarding_1.png"),
    title: "Do you know what your car really costs you?",
    description:
      "Track fuel, servicing, insurance, and more, all in one place and see the real cost of owning your vehicle.",
  },
  {
    id: "2",
    Image: Img2,
    bgImage: require("@/assets/images/onboarding_2.png"),
    title: "Never miss important car maintenance",
    description:
      "Stay ahead of servicing, inspections, and repairs with reminders that keep your car running smoothly.",
  },
  {
    id: "3",
    Image: Img3,
    bgImage: require("@/assets/images/onboarding_3.png"),
    title: "Tired of losing receipts and service records?",
    description:
      "Store every receipt, expense, and document in one organized digital folder for your vehicle.",
  },
  {
    id: "4",
    Image: Img4,
    bgImage: require("@/assets/images/onboarding_4.png"),
    title: "Make smarter decisions about your car",
    description:
      "View spending trends, driving costs and maintenance insights that help you stay ahead of problems.",
  },
  {
    id: "5",
    Image: Img5,
    bgImage: require("@/assets/images/onboarding_5.png"),
    title: "Getting overcharged by mechanics?",
    description:
      "Access a full service history and expense report so you avoid paying more than you should.",
  },
];

const BlobBackground = () => (
  <View
    className="absolute w-[180px] h-[350px] bg-[#9BBABB]/25 rounded-full"
    style={{ transform: [{ rotate: "0deg" }] }}
  />
);

export default function WelcomeScreen() {
  const { mutate: socialLogin, isPending } = useSocialLogin();
  const user = useAuthStore((state) => state.user);
  const { showSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= SLIDES.length) {
        nextIndex = 0;
      }
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleSocialAuth = (provider: string) => {
    const mockData = {
      email: "social_user@test.com",
      provider,
      providerId: `mock_${provider}_id`,
      name: "Social User",
      preferredCurrency: user?.preferredCurrency,
      country: user?.country,
    };

    socialLogin(mockData, {
      onSuccess: () => {
        showSnackbar({
          type: "success",
          message: "Social Login Successful",
          description: `Welcome! Your region is set to ${user?.country || "Default"}.`,
        });
        router.replace("/(onboarding)");
      },
      onError: (error: any) => {
        showSnackbar({
          type: "error",
          message: "Social Login Failed",
          description: error.response?.data?.message || "Something went wrong",
        });
      },
    });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  }).current;

  return (
    <View className="flex-1 bg-[#013037]">

      {/* 1. Static Overlay: Fixed Header Logo */}
      <View className="absolute top-0 w-full items-center pt-20" style={{ zIndex: 40 }}>
        <LogoIcon width={130} height={34} fill="#00AEB5" />
      </View>

      {/* 2. Main Sliding Content */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }} className="flex-1">
            {/* Sliding Environmental Background */}
            <Image 
              source={item.bgImage} 
              className="absolute inset-0 w-full h-[65%]"
              resizeMode="cover"
            />
            
            {/* Blending Gradient: PNG -> Solid Teal */}
            <LinearGradient
              colors={["transparent", "rgba(1, 48, 55, 0.4)", "#013037", "#013037"]}
              stops={[0, 0.4, 0.85, 1]}
              className="absolute top-[25%] left-0 right-0 h-[75%]"
            />

            {/* Dark Overlay for Background Contrast */}
            <View className="absolute inset-0 bg-[#002D32]/80 h-full" />

            <View className="flex-1 items-center px-8 pt-44">
              {/* Artwork Area */}
              <View className="items-center justify-center w-full h-[35%] mb-4">
                <BlobBackground />
                <View className="z-10">
                  <item.Image width={350} height={350} />
                </View>
              </View>

              {/* Text Content */}
              <View className="mt-4 items-center w-full px-2">
                <Text className="text-[#FFFFFF] text-center text-[28px] font-lexendBold leading-[34px] mb-3">
                  {item.title}
                </Text>
                <Text className="text-[#9BBABB] text-center font-lexendRegular text-[14px] leading-[22px] px-2">
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* 3. Static Overlay: Fixed Bottom Auth Section */}
      <View 
        className="absolute bottom-0 w-full pb-10 pt-6 px-10" 
        style={{ zIndex: 50 }}
      >
        <View className="items-center">
          {/* Static Pagination Dots */}
          <View className="flex-row justify-center mb-10">
            {SLIDES.map((_, dotIdx) => (
              <View
                key={dotIdx}
                className={`h-1.5 rounded-full mx-1 ${activeIndex === dotIdx ? "w-6 bg-[#FFFFFF]" : "w-6 bg-[#09515D]"}`}
              />
            ))}
          </View>

          <SocialAuthButtons onAuth={handleSocialAuth} />

          <View className="mt-6 items-center">
            <Text className="text-[#31828E] text-center font-lexendMedium text-[10px] leading-4 mb-4">
              By signing up, you accept moticar’s{" "}
              <Text className="text-[#FDEF56]">Terms of Service</Text> and{" "}
              <Text className="text-[#FDEF56]">Membership Terms</Text>, and
              acknowledge the{" "}
              <Text className="text-[#FDEF56]">Privacy Policy</Text>
            </Text>

            <View className="flex-row gap-2 items-center justify-center">
              <Text className="text-[#FFFFFF] text-[15px] font-lexendMedium">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-[#00AEB5] font-lexendBold text-[15px]">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
