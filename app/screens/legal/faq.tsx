import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
} from "react-native";
import { Document } from "@contentful/rich-text-types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { contentfulService, LegalDocument } from "@/lib/contentful";
import { documentToReactNativeComponents } from "@/utils/richTextRenderer";
import { LoadingModal } from "@/components/ui/LoadingModal";

export default function FaqScreen() {
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoc = async () => {
    try {
      setLoading(true);
      setError(null);
      const doc = await contentfulService.getFaq();
      setDocument(doc);
    } catch (err) {
      setError("Failed to load FAQ");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoc();
  }, []);

  if (loading) {
    return (<LoadingModal visible={true}/>
    );
  }

  if (error || !document) {
    return (
      <SafeAreaView className="flex-1 bg-[#EEF5F5]">
        <View className="flex-row items-center px-4 py-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#001A1F" />
          </Pressable>
          <Text className="ml-4 font-lexendSemiBold text-xl text-[#001A1F]">
            FAQ
          </Text>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={48} color="#8B8B8B" />
          <Text className="mt-4 text-center font-lexendRegular text-[#8B8B8B]">
            {error || "FAQ not found"}
          </Text>
          <Pressable
            className="mt-6 bg-[#00AEB5] px-6 py-3 rounded-full"
            onPress={fetchDoc}
          >
            <Text className="font-lexendMedium text-white text-sm">Try again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#EEF5F5]">
      <View className="flex-row items-center px-4 py-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#001A1F" />
        </Pressable>
        <Text className="ml-4 font-lexendSemiBold text-xl text-[#001A1F]">
          {document.title}
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {document.lastUpdated && (
          <Text className="mb-6 font-lexendRegular text-sm text-[#8B8B8B]">
            Last updated: {new Date(document.lastUpdated).toLocaleDateString()}
          </Text>
        )}
        {documentToReactNativeComponents(document.content as Document)}
      </ScrollView>
    </SafeAreaView>
  );
}
