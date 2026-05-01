import LogoIcon from "@/assets/images/logowhite.svg";
import { useSocialAuth } from "@/hooks/useSocialAuth";
import { LoadingModal } from "@/components/ui/LoadingModal";
import { useSnackbar } from "@/providers/SnackbarProvider";
import { useAuthStore } from "@/store/useAuthStore";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
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

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    Image: Img1,
    bgImage: require("@/assets/images/onboarding_4.png"),
    title: "Do you know what your car really costs you?",
    description:
      "Track fuel, servicing, insurance, and more, all in one place and see the real cost of owning your vehicle.",
  },
  {
    id: "2",
    Image: Img3,
    bgImage: require("@/assets/images/onboarding_2.png"),
    title: "Never miss important car maintenance",
    description:
      "Stay ahead of servicing, inspections, and repairs with reminders that keep your car running smoothly.",
  },
  {
    id: "3",
    Image: Img2,
    bgImage: require("@/assets/images/onboarding_3.png"),
    title: "Tired of losing receipts and service records?",
    description:
      "Store every receipt, expense, and document in one organized digital folder for your vehicle.",
  },
  {
    id: "4",
    Image: Img4,
    bgImage: require("@/assets/images/onboarding_1.png"),
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

export default function WelcomeScreen() {
  const user = useAuthStore((state) => state.user);
  const { showSnackbar } = useSnackbar();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Auto-advance slides every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % SLIDES.length;
      setActiveIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4500);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const {
    loginWithApple,
    loginWithGoogle,
    isPending: socialPending,
  } = useSocialAuth({
    onSuccess: (data) => {
      showSnackbar({
        type: "success",
        message: "Social Login Successful",
        description: `Welcome! Your region is set to ${user?.country || "Default"}.`,
      });

      if (data.user?.onboardingCompleted) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(onboarding)");
      }
    },
    onError: (error: any) => {
      showSnackbar({
        type: "error",
        message: "Social Login Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleSocialAuth = (provider: string) => {
    if (provider === "apple") loginWithApple();
    else if (provider === "google") loginWithGoogle();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null) setActiveIndex(index);
    }
  }).current;

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }} 
      bounces={false} 
      showsVerticalScrollIndicator={false}
      className="bg-[#013037]"
    >
      <View className="flex-1 bg-[#013037]" style={{ minHeight: 820 }}>
        {/* ── Fixed Header: Logo ── */}
        <View
          className="absolute top-0 w-full items-center pt-16"
          style={{ zIndex: 40 }}
        >
          <LogoIcon width={130} height={34} />
        </View>

        {/* ── Sliding Content ── */}
        <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH }} className="flex-1">
            {/* Background photo — top ~62% of screen */}
            <Image
              source={item.bgImage}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "62%",
              }}
              resizeMode="cover"
            />

            {/* Dark tint over photo so the image doesn't overpower */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "62%",
                backgroundColor: "#023138a6",
              }}
            />

            {/* Gradient: photo fades into solid teal background */}
            <LinearGradient
              colors={["transparent", "rgba(1,48,55,0.85)", "#013037"]}
              locations={[0, 0.55, 1]}
              style={{
                position: "absolute",
                top: "38%",
                left: 0,
                right: 0,
                height: "35%",
              }}
            />

            {/* Slide body */}
            <View
              className="flex-1 items-center px-8"
              style={{ paddingTop: 120 }}
            >
              {/* Character illustration + key icon */}
              <View
                className="items-center justify-center w-full"
                style={{ height: 320, zIndex: 1 }}
              >
                <Image
                  source={require("@/assets/icons/key.png")}
                  style={{
                    position: "absolute",
                    top: 100,
                    width: 281,
                    height: 207,
                    opacity: 0.5,
                  }}
                  resizeMode="contain"
                />
                <item.Image width={399} height={363} style={{ zIndex: 2 }} />
              </View>

              {/* Title + description */}
              <View className="items-center w-full mt-4 px-2" style={{ zIndex: 10 }}>
                <Text 
                  className="text-white text-[1.625rem] text-center font-lexendBold leading-[34px] mb-3"
                  maxFontSizeMultiplier={1.2}
                >
                  {item.title}
                </Text>
                <Text 
                  className="text-[#76D7E6] text-center font-lexendSemiBold px-1 text-[0.75rem]"
                  maxFontSizeMultiplier={1.3}
                >
                  {item.description}
                </Text>
              </View>
            </View>
          </View>
        )}
      />

      {/* ── Fixed Bottom: Dots + Buttons ── */}
      <View
        className="mt-auto w-full px-8 pb-14"
        style={{ zIndex: 50 }}
      >
        {/* Pagination dots */}
        <View className="flex-row justify-center mb-6">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={{
                height: 5,
                width: activeIndex === i ? 24 : 18,
                borderRadius: 3,
                marginHorizontal: 3,
                backgroundColor: activeIndex === i ? "#FFFFFF" : "#09515D",
              }}
            />
          ))}
        </View>

        {/* Apple + Google + Email buttons */}
        <SocialAuthButtons onAuth={handleSocialAuth} />
        <LoadingModal visible={socialPending} message="Signing you in..." />

        {/* Legal */}
        <Text 
          className="text-[#31828E] text-center font-lexendMedium mt-10 leading-[16px] text-[0.875rem]"
          maxFontSizeMultiplier={1.3}
        >
          By signing up, you accept moticar's{" "}
          <Text 
            className="text-[#FDEF56]" 
            onPress={() => router.push("/screens/legal/terms-and-conditions")}
          >
            Terms of Service
          </Text> and{" "}
          <Text 
            className="text-[#FDEF56]"
            onPress={() => router.push("/screens/legal/membership-terms")}
          >
            Membership Terms
          </Text>, and
          acknowledge the <Text 
            className="text-[#FDEF56]"
            onPress={() => router.push("/screens/legal/privacy-policy")}
          >
            Privacy Policy
          </Text>
        </Text>

        {/* Sign in */}
        <View className="flex-row items-center justify-center mt-3 gap-1">
          <Text 
            className="text-white font-lexendMedium text-[1.125rem]"
            maxFontSizeMultiplier={1.2}
          >
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text 
              className="text-[#29D7DE] font-lexendMedium text-[1.125rem]"
              maxFontSizeMultiplier={1.2}
            >
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </ScrollView>
  );
}
