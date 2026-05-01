import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUpdateProfile } from '@/hooks/useAuth';
import { useSnackbar } from '@/providers/SnackbarProvider';

interface LocationAlertProps {
  country?: string;
  suggestedCurrency: string;
  onDismiss: () => void;
  message?: string;
}

export default function LocationAlert({ country, suggestedCurrency, onDismiss, message }: LocationAlertProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const { showSnackbar } = useSnackbar();

  const handleSwitch = () => {
    updateProfile(
      { 
        preferredCurrency: suggestedCurrency,
        country: country
      },
      {
        onSuccess: () => {
          showSnackbar({
            type: "success",
            message: "Currency Switched!",
            description: `Your expenses have been converted to ${suggestedCurrency}.`,
          });
          onDismiss();
        },
      }
    );
  };

  return (
    <View className="mx-4 mt-4 bg-[#00AEB5]/10 border border-[#00AEB5]/30 rounded-[20px] p-5 flex-row items-start gap-4">
      <View className="bg-[#00AEB5]/20 p-2.5 rounded-full mt-1">
        <Ionicons name="navigate" size={20} color="#00AEB5" />
      </View>
      
      <View className="flex-1">
        <Text className="text-white font-lexendSemiBold text-[0.9375rem]">
          {message || `New location detected: ${country}`}
        </Text>
        <Text className="text-[#9BBABB] font-lexendRegular text-[0.8125rem] mt-1.5 leading-5">
          Would you like to switch your currency to {suggestedCurrency}? This will also convert your existing expenses.
        </Text>
        
        <View className="flex-row gap-4 mt-4">
          <TouchableOpacity 
            onPress={handleSwitch}
            disabled={isPending}
            className="bg-[#29D7DE] px-5 py-2.5 rounded-full flex-row items-center justify-center min-w-[120px]"
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#00343F" />
            ) : (
              <Text className="text-[#00343F] font-lexendBold text-[0.8125rem]">
                Switch Now
              </Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={onDismiss}
            disabled={isPending}
            className="px-4 py-2.5 items-center justify-center"
          >
            <Text className="text-[#9BBABB] font-lexendMedium text-[0.8125rem]">
              Dismiss
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
