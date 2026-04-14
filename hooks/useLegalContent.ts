import { useQuery } from "@tanstack/react-query";
import { contentfulClient } from "@/lib/contentful";
import { LegalContent } from "@/types/contentful";

/**
 * Hook to fetch legal content from Contentful (e.g., Terms and Conditions, Privacy Policy).
 * 
 * @param slug The slug of the entry to fetch (e.g., 'terms-and-conditions').
 * @param contentType The content type ID (default is 'termsAndConditions').
 */
export const useLegalContent = (slug: string, contentType: string = "termsAndConditions") => {
  return useQuery({
    queryKey: ["legalContent", contentType, slug],
    queryFn: async () => {
      const response = await contentfulClient.getEntries({
        content_type: contentType,
        "fields.slug": slug,
        limit: 1,
      });

      if (response.items.length === 0) {
        throw new Error(`Content not found for slug: ${slug}`);
      }

      const item = response.items[0];
      return {
        title: item.fields.title as string,
        slug: item.fields.slug as string,
        content: item.fields.content,
        version: item.fields.version as string,
        lastUpdated: item.fields.lastUpdated as string,
      } as LegalContent;
    },
    enabled: !!slug,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (legal content rarely changes)
  });
};
