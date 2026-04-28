import { createClient } from "contentful";


import { Document } from '@contentful/rich-text-types';

// Contentful client configuration
const client = createClient({
  space: process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN || '',
});

export interface LegalDocument {
  title: string;
  slug: string;
  content: Document;
  lastUpdated?: string;
}

export type LegalDocSlug =
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'membership-terms'
  | 'faq';

// Transform Contentful entry to our format
const transformLegalDocument = (entry: any): LegalDocument => {
  return {
    title: entry.fields.title,
    slug: entry.fields.slug,
    content: entry.fields.content,
    lastUpdated: entry.fields.lastUpdated,
  };
};

export const contentfulService = {
  /**
   * Fetch Terms and Conditions document
   */
  async getTermsAndConditions(): Promise<LegalDocument | null> {
    try {
      const response = await client.getEntries({
        content_type: 'legal-doc',
        'fields.slug': 'terms-and-conditions',
        limit: 1,
      });

      if (response.items.length === 0) {
        return null;
      }

      return transformLegalDocument(response.items[0]);
    } catch (error) {
      console.error('Error fetching Terms and Conditions:', error);
      throw error;
    }
  },

  /**
   * Fetch Privacy Policy document
   */
  async getPrivacyPolicy(): Promise<LegalDocument | null> {
    try {
      const response = await client.getEntries({
        content_type: 'legal-doc',
        'fields.slug': 'privacy-policy',
        limit: 1,
      });

      if (response.items.length === 0) {
        return null;
      }

      return transformLegalDocument(response.items[0]);
    } catch (error) {
      console.error('Error fetching Privacy Policy:', error);
      throw error;
    }
  },

  /**
   * Fetch Terms of Service document
   */
  async getTermsOfService(): Promise<LegalDocument | null> {
    return contentfulService.getLegalDocumentBySlug('terms-and-conditions');
  },

  /**
   * Fetch Membership Terms document
   */
  async getMembershipTerms(): Promise<LegalDocument | null> {
    return contentfulService.getLegalDocumentBySlug('membership-terms');
  },

  /**
   * Fetch FAQ document
   */
  async getFaq(): Promise<LegalDocument | null> {
    return contentfulService.getLegalDocumentBySlug('faq');
  },

  /**
   * Fetch any legal document by slug
   */
  async getLegalDocumentBySlug(slug: string): Promise<LegalDocument | null> {
    try {
      const response = await client.getEntries({
        content_type: 'legal-doc',
        'fields.slug': slug,
        limit: 1,
      });

      if (response.items.length === 0) {
        return null;
      }

      return transformLegalDocument(response.items[0]);
    } catch (error) {
      console.error(`Error fetching legal document with slug "${slug}":`, error);
      throw error;
    }
  },
}