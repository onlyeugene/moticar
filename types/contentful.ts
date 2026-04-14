import { EntryFieldTypes } from "contentful";

export interface LegalContent {
  title: string;
  slug: string;
  content: any; // Contentful Rich Text
  version?: string;
  lastUpdated?: string;
}

export type LegalContentEntry = {
  contentTypeId: "termsAndConditions" | "privacyPolicy" | "disclaimer";
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
    version?: EntryFieldTypes.Text;
    lastUpdated?: EntryFieldTypes.Date;
  };
};
