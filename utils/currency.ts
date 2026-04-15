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
  { label: "AED", value: "AED", symbol: "د.إ", country: "UAE" },
  { label: "Australian Dollar", value: "AUD", symbol: "A$", country: "Australia" },
  { label: "BRL", value: "BRL", symbol: "R$", country: "Brazil" },
  { label: "CHF", value: "CHF", symbol: "Fr", country: "Switzerland" },
  { label: "DKK", value: "DKK", symbol: "kr", country: "Denmark" },
  { label: "EGP", value: "EGP", symbol: "E£", country: "Egypt" },
  { label: "HKD", value: "HKD", symbol: "HK$", country: "Hong Kong" },
  { label: "ILS", value: "ILS", symbol: "₪", country: "Israel" },
  { label: "KRW", value: "KRW", symbol: "₩", country: "South Korea" },
  { label: "MAD", value: "MAD", symbol: "DH", country: "Morocco" },
  { label: "NZD", value: "NZD", symbol: "NZ$", country: "New Zealand" },
  { label: "RUB", value: "RUB", symbol: "₽", country: "Russia" },
  { label: "RWF", value: "RWF", symbol: "RF", country: "Rwanda" },
  { label: "SAR", value: "SAR", symbol: "ر.س", country: "Saudi Arabia" },
  { label: "SEK", value: "SEK", symbol: "kr", country: "Sweden" },
  { label: "SGD", value: "SGD", symbol: "S$", country: "Singapore" },
  { label: "TRY", value: "TRY", symbol: "₺", country: "Turkey" },
  { label: "TZS", value: "TZS", symbol: "TSh", country: "Tanzania" },
  { label: "UGX", value: "UGX", symbol: "USh", country: "Uganda" },
  { label: "XAF", value: "XAF", symbol: "FCFA", country: "Central Africa" },
  { label: "XOF", value: "XOF", symbol: "CFA", country: "West Africa" },
];

export const getCurrencySymbol = (code?: string) => {
  const currency = CURRENCIES.find(c => c.value === code);
  return currency ? currency.symbol : "₦";
};

export const getLanguageFlag = (code?: string) => {
  const lang = LANGUAGES.find(l => l.value === code);
  return lang ? lang.flag : "🇺🇸"; // Default to US flag for English
};
