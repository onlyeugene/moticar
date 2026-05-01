import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/store/useAppStore";
import { obdService } from "@/services/api/obdService";
import DiagnosticChecking from "./DiagnosticChecking";
import DiagnosticResults from "./DiagnosticResults";
import { Ionicons } from "@expo/vector-icons";

/**
 * Main container for the Diagnostic flow.
 * Handles the sequence from Scanning -> Results.
 */
export default function DiagnosticView() {
  const [step, setStep] = useState<"checking" | "results">("checking");
  const { selectedCarId, setDiagnosticActive, isDiagnosticActive } = useAppStore();
  
  // Safety guard: if no car is selected, we shouldn't be in diagnostic mode
  useEffect(() => {
    if (isDiagnosticActive && !selectedCarId) {
      setDiagnosticActive(false);
    }
  }, [isDiagnosticActive, selectedCarId]);

  const { data: report, isLoading, isError, error } = useQuery({
    queryKey: ['diagnosticReport', selectedCarId],
    queryFn: () => obdService.getDiagnosticReport(selectedCarId!),
    enabled: !!selectedCarId && isDiagnosticActive,
    retry: 1,
  });

  useEffect(() => {
    if (report && !isLoading) {
      setStep("results");
    }
  }, [report, isLoading]);

  const handleCancel = () => {
    setDiagnosticActive(false);
  };

  if (!isDiagnosticActive) return null;

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center p-10 mt-10">
        <Ionicons name="alert-circle-outline" size={64} color="#F8953A" />
        <Text className="text-white font-lexendBold text-[1.25rem] mt-4 text-center">
          Connection Failed
        </Text>
        <Text className="text-[#81B4B4] font-lexendRegular text-[0.875rem] mt-2 text-center">
          {(error as any)?.response?.data?.error || "We couldn't connect to your MotiBuddie. Please make sure it's plugged in and the engine is running."}
        </Text>
        <TouchableOpacity 
          onPress={handleCancel}
          className="bg-[#29D7DE] px-8 py-3 rounded-full mt-8"
        >
          <Text className="text-[#00343F] font-lexendBold">Got it</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {step === "checking" ? (
        <DiagnosticChecking onCancel={handleCancel} />
      ) : (
        <DiagnosticResults onCancel={handleCancel} report={report} />
      )}
    </View>
  );
}
