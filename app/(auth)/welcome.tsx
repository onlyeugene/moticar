import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import LogoIcon from "@/assets/icons/logo.svg";
import { SocialAuthButtons } from "../../components/SocialAuthButtons";
import { useSocialLogin } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useSnackbar } from "@/providers/SnackbarProvider";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    image: require("@/assets/images/onboarding_1.png"),
    title: "Do you know what your car really costs you?",
    description:
      "Track fuel, servicing, insurance, and more, all in one place and see the real cost of owning your vehicle.",
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding_2.png"),
    title: "Never miss important car maintenance",
    description:
      "Stay ahead of servicing, inspections, and repairs with reminders that keep your car running smoothly.",
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding_3.png"),
    title: "Tired of losing receipts and service records?",
    description:
      "Store every receipt, expense, and document in one organized digital folder for your vehicle.",
  },
  {
    id: "4",
    image: require("@/assets/images/onboarding_4.png"),
    title: "Make smarter decisions about your car",
    description:
      "View spending trends, driving costs and maintenance insights that help you stay ahead of problems.",
  },
  {
    id: "5",
    image: require("@/assets/images/onboarding_5.png"),
    title: "Getting overcharged by mechanics?",
    description:
      "Access a full service history and expense report so you avoid paying more than you should.",
  },
];

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
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(timer);
  }, [activeIndex]);

  const handleSocialAuth = (provider: string) => {
    // Mock social media data for demo
    const mockData = {
      email: "social_user@test.com",
      provider,
      providerId: `mock_${provider}_id`,
      name: "Social User",
      preferredCurrency: user?.preferredCurrency,
      country: user?.country
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
      }
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
      {/* Background Image Slider */}
      <View className="absolute top-0 w-full h-[65%]">
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
          onScrollToIndexFailed={(info) => {
            flatListRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH }} className="h-full">
              <Image
                source={item.image}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Overlay Gradient for Text Readability - "Eating into the image" */}
              <LinearGradient
                colors={["#004E5A00", "#013037"]}
                locations={[0.2, 0.9]}
                className="absolute inset-0"
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Static Logo at Top */}
      <View className="absolute top-0 w-full items-center pt-20">
        <LogoIcon width={120} height={30} fill="#00AEB5" />
      </View>

      {/* Moving Text Content */}
      <View
        className="absolute top-[52%] w-full h-[15%]"
        style={{ zIndex: 10 }}
        pointerEvents="none"
      >
        <FlatList
          data={SLIDES}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View
              style={{ width: SCREEN_WIDTH }}
              className="px-10 justify-center"
            >
              <Text className="text-[#FFFFFF] text-center text-[30px] font-lexendBold leading-[32px] mb-2">
                {item.title}
              </Text>
              <Text className="text-[#76D7E6] text-center font-lexendRegular text-[13px] leading-[20px]">
                {item.description}
              </Text>
            </View>
          )}
          // Set manual offset based on activeIndex to sync
          contentOffset={{ x: activeIndex * SCREEN_WIDTH, y: 0 }}
          keyExtractor={(item) => item.id}
        />
      </View>

      {/* Static Bottom Auth Section */}
      <View className="absolute bottom-0 w-full pb-10">
        <LinearGradient
          colors={["#004E5A00", "#013037"]}
          locations={[0, 0.5]}
          style={{
            position: "absolute",
            top: -200,
            left: 0,
            right: 0,
            height: 200,
          }}
        />

        <View className="items-center">
          {/* Pagination Dots */}
          <View className="flex-row justify-center mb-8">
            {SLIDES.map((_, index) => (
              <View
                key={index}
                className={`h-1.5 rounded-full mx-[2px] ${activeIndex === index ? "w-6 bg-[#FFFFFF]" : "w-6 bg-[#09515D]"}`}
              />
            ))}
          </View>

          <SocialAuthButtons onAuth={handleSocialAuth} />

          <View className="mt-6 px-10">
            <Text className="text-[#31828E] text-center font-lexendMedium text-[14px] ">
              By signing up, you accept moticar’s{" "}
              <Text className="text-[#FDEF56]">Terms of Service</Text> and{" "}
              <Text className="text-[#FDEF56]">Membership Terms</Text>, and
              acknowledge the{" "}
              <Text className="text-[#FDEF56]">Privacy Policy</Text>
            </Text>

            <View className="flex-row gap-2 items-center justify-center mt-6">
              <Text className="text-[#FFFFFF] text-[16px] font-lexendMedium">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-[#00AEB5] font-lexendBold text-[16px]">
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
