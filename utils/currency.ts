export const LANGUAGES = [
  { label: "English (US)", value: "en-US", flag: "🇺🇸" },
  { label: "English (UK)", value: "en-GB", flag: "🇬🇧" },
  { label: "Yoruba", value: "yo-NG", flag: "🇳🇬" },
  { label: "Pidgin", value: "pcm-NG", flag: "🇳🇬" },
  { label: "French", value: "fr-FR", flag: "🇫🇷" },
  { label: "German", value: "de-DE", flag: "🇩🇪" },
  { label: "Spanish", value: "es-ES", flag: "🇪🇸" },
  { label: "Chinese", value: "zh-CN", flag: "🇨🇳" },
];

export const CURRENCIES = [
  { label: "Naira", value: "NGN", symbol: "₦", country: "Nigeria" },
  { label: "US Dollar", value: "USD", symbol: "$", country: "United States" },
  { label: "British Pound", value: "GBP", symbol: "£", country: "United Kingdom" },
  { label: "Euro", value: "EUR", symbol: "€", country: "European Union" },
  { label: "Canadian Dollar", value: "CAD", symbol: "C$", country: "Canada" },
  { label: "Australian Dollar", value: "AUD", symbol: "A$", country: "Australia" },
  { label: "Japanese Yen", value: "JPY", symbol: "¥", country: "Japan" },
  { label: "Indian Rupee", value: "INR", symbol: "₹", country: "India" },
  { label: "Chinese Yuan", value: "CNY", symbol: "¥", country: "China" },
  { label: "South African Rand", value: "ZAR", symbol: "R", country: "South Africa" },
  { label: "Kenyan Shilling", value: "KES", symbol: "KSh", country: "Kenya" },
  { label: "Ghanaian Cedi", value: "GHS", symbol: "GH₵", country: "Ghana" },
];

export const getCurrencySymbol = (code?: string) => {
  const currency = CURRENCIES.find(c => c.value === code);
  return currency ? currency.symbol : "₦";
};

export const getLanguageFlag = (code?: string) => {
  const lang = LANGUAGES.find(l => l.value === code);
  return lang ? lang.flag : "🇺🇸"; // Default to US flag for English
};
