import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { useMe, useCheckLocation, useUpdateProfile } from '@/hooks/useAuth';
import LogoIcon from '../assets/icons/logo.svg';

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  
  // 🟢 Always fetch fresh profile on startup if we have a token to ensure onboarding status is current
  const { data: freshUser, isLoading: isFetchingUser } = useMe(!!token);

  useEffect(() => {
    console.log("📍 [Index] Auth State Check:", { 
      hasToken: !!token, 
      hasUser: !!user, 
      freshUserAvailable: !!freshUser,
      onboardingCompleted: user?.onboardingCompleted || freshUser?.onboardingCompleted
    });
    
    const timer = setTimeout(() => {
      if (token) {
        const finalOnboardingStatus = user?.onboardingCompleted || freshUser?.onboardingCompleted;
        
        if (finalOnboardingStatus) {
          router.replace('/(tabs)');
        } else {
          // Only redirect if we are NOT still fetching a potentially fresh status
          if (!isFetchingUser) {
            router.replace('/(onboarding)');
          }
        }
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, token, user, freshUser, isFetchingUser]);

  return (
    <View className="flex-1 bg-[#FBE74C] items-center justify-center">
      <View className="items-center">
        <LogoIcon width={228} height={58} />
        <Text className="mt-10 text-[14px] text-[#00232A] font-lexendSemiBold">
          ...making sense of every spend
        </Text>
      </View>
    </View>
  );
}
