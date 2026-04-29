import React, { useRef } from "react";
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";
import { OtpInputProps } from "@/types/ui";

/**
 * A custom OTP input component with multiple boxes.
 * Handles auto-focus, backspace navigation, and automatic prefill (autofill).
 */
export const OtpInput: React.FC<OtpInputProps> = ({ value, onChange, length = 5 }) => {
  const inputRefs = useRef<TextInput[]>([]);
  
  // Ensure we have an array of digits of fixed length
  const digits = value.split("").concat(new Array(length).fill("")).slice(0, length);

  const handleChange = (text: string, index: number) => {
    // If text length is > 1, it's likely a paste or autofill event
    if (text.length > 1) {
      const pasteData = text.replace(/[^0-9]/g, "").slice(0, length);
      onChange(pasteData);
      
      // Focus the last filled box or the next empty box
      const nextIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newDigits = [...digits];
    // If text is empty, it means clear, otherwise take the character
    newDigits[index] = text;
    
    const newCode = newDigits.join("").slice(0, length);
    onChange(newCode);

    // Auto focus next input if a character was entered
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    // Handle backspace to move focus to previous input
    if (e.nativeEvent.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      }
    }
  };

  return (
    <View className="flex-row justify-between w-full">
      {digits.map((digit, index) => (
        <View 
          key={index}
          className={`w-[60px] h-[70px] rounded-xl border items-center justify-center bg-[#012227] ${
            digit ? 'border-[#43E4E9]' : 'border-[#09515D]'
          }`}
        >
          <TextInput
            ref={(ref) => {
              inputRefs.current[index] = ref as TextInput;
            }}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={index === 0 ? length : 1} // Allow first box to receive full code for autofill/paste
            className="text-white text-[24px] font-lexendBold text-center w-full h-full"
            style={{ textAlignVertical: "center" }}
            selectionColor="#43E4E9"
            textContentType="oneTimeCode" // Essential for iOS autofill
            autoComplete="one-time-code" // Essential for Android autofill
            importantForAutofill="yes"
          />
        </View>
      ))}
    </View>
  );
};
