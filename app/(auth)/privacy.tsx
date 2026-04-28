import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Document } from "@contentful/rich-text-types";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { contentfulService, LegalDocument } from "@/lib/contentful";
import { documentToReactNativeComponents } from "@/utils/richTextRenderer";
import { LoadingModal } from "@/components/ui/LoadingModal";

export default function PrivacyScreen() {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacy = async () => {
      try {
        setLoading(true);
        const privacy = await contentfulService.getPrivacyPolicy();
        setDocument(privacy);
      } catch (err) {
        setError("Failed to load Privacy Policy");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacy();
  }, []);

  if (loading) {
    return (<LoadingModal visible={true}/>
    );
  }

  if (error || !document) {
    return (
      <SafeAreaView className="flex-1 bg-[#ECE0E2]">
        <View className="flex-row items-center px-4 py-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </Pressable>
          <Text className="ml-4 font-lexendSemiBold text-xl">
            Privacy Policy
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#888" />
          <Text className="mt-4 text-center font-lexendRegular text-[#888]">
            {error || "Privacy Policy not found"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#ECE0E2]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </Pressable>
        <Text className="ml-4 font-lexendSemiBold text-xl">
          {document.title}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Last Updated */}
        {document.lastUpdated && (
          <Text className="mb-6 font-lexendRegular text-sm text-[#888]">
            Last updated: {new Date(document.lastUpdated).toLocaleDateString()}
          </Text>
        )}

        {/* Rich Text Content */}
        {documentToReactNativeComponents(document.content as Document)}
      </ScrollView>
    </SafeAreaView>
  );
}
