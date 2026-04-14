import { createClient } from "contentful";

const space = process.env.EXPO_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.EXPO_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  console.warn(
    "Contentful Space ID or Access Token is missing. Please check your environment variables."
  );
}

export const contentfulClient = createClient({
  space: space || "",
  accessToken: accessToken || "",
});
