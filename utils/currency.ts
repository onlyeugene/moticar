import German from '@/assets/flags/german.svg'
import UK from '@/assets/flags/uk.svg'
import French from '@/assets/flags/france.svg'
import Nigeria from '@/assets/flags/nigeria.svg'
import SouthAfrica from '@/assets/flags/za.svg'
import USA from '@/assets/flags/usa.svg'
import Europe from '@/assets/flags/un.svg'
import Ghana from '@/assets/flags/ghana.svg'

// New imports for complete coverage
import flagES from '@/assets/flags/es.svg'
import flagCN from '@/assets/flags/cn.svg'
import flagPT from '@/assets/flags/pt.svg'
import flagCA from '@/assets/flags/ca.svg'
import flagAU from '@/assets/flags/au.svg'
import flagJP from '@/assets/flags/jp.svg'
import flagIN from '@/assets/flags/in.svg'
import flagKE from '@/assets/flags/ke.svg'
import flagAE from '@/assets/flags/ae.svg'
import flagBR from '@/assets/flags/br.svg'
import flagCH from '@/assets/flags/ch.svg'
import flagDK from '@/assets/flags/dk.svg'
import flagEG from '@/assets/flags/eg.svg'
import flagHK from '@/assets/flags/hk.svg'
import flagIL from '@/assets/flags/il.svg'
import flagKR from '@/assets/flags/kr.svg'
import flagMA from '@/assets/flags/ma.svg'
import flagNZ from '@/assets/flags/nz.svg'
import flagRU from '@/assets/flags/ru.svg'
import flagRW from '@/assets/flags/rw.svg'
import flagSA from '@/assets/flags/sa.svg'
import flagSE from '@/assets/flags/se.svg'
import flagSG from '@/assets/flags/sg.svg'
import flagTR from '@/assets/flags/tr.svg'
import flagTZ from '@/assets/flags/tz.svg'
import flagUG from '@/assets/flags/ug.svg'
import flagCM from '@/assets/flags/cm.svg'
import flagCI from '@/assets/flags/ci.svg'

export const LANGUAGES = [
  { label: "English", value: "en-GB", flag: UK },
  { label: "French", value: "fr-FR", flag: French },
  { label: "German", value: "de-DE", flag: German },
  { label: "Spanish", value: "es-ES", flag: flagES },
  { label: "Chinese", value: "zh-CN", flag: flagCN },
  { label: "Portuguese", value: "pt-PT", flag: flagPT }
];

export const CURRENCIES = [
  { label: "Dollars", value: "USD", symbol: "$", country: "USA", isoCode: "US", icon: USA },
  { label: "British Pound Sterling", value: "GBP", symbol: "£", country: "UK", isoCode: "GB", icon: UK },
  { label: "Euros", value: "EUR", symbol: "€", country: "Europe", isoCode: "FR", icon: Europe }, // Using FR or DE as a representative for Euro zone
  { label: "Canadian Dollar", value: "CAD", symbol: "C$", country: "Canada", isoCode: "CA", icon: flagCA },
  { label: "Australian Dollar", value: "AUD", symbol: "A$", country: "Australia", isoCode: "AU", icon: flagAU },
  { label: "Japanese Yen", value: "JPY", symbol: "¥", country: "Japan", isoCode: "JP", icon: flagJP },
  { label: "Indian Rupee", value: "INR", symbol: "₹", country: "India", isoCode: "IN", icon: flagIN },
  { label: "Chinese Yuan", value: "CNY", symbol: "¥", country: "China", isoCode: "CN", icon: flagCN },
  { label: "South African Rand", value: "ZAR", symbol: "R", country: "South Africa", isoCode: "ZA", icon: SouthAfrica },
  { label: "Kenyan Shilling", value: "KES", symbol: "KSh", country: "Kenya", isoCode: "KE", icon: flagKE },
  { label: "Ghanaian Cedi", value: "GHS", symbol: "GH₵", country: "Ghana", isoCode: "GH", icon: Ghana },
  { label: "AED", value: "AED", symbol: "د.إ", country: "UAE", isoCode: "AE", icon: flagAE },
  { label: "BRL", value: "BRL", symbol: "R$", country: "Brazil", isoCode: "BR", icon: flagBR },
  { label: "CHF", value: "CHF", symbol: "Fr", country: "Switzerland", isoCode: "CH", icon: flagCH },
  { label: "DKK", value: "DKK", symbol: "kr", country: "Denmark", isoCode: "DK", icon: flagDK },
  { label: "EGP", value: "EGP", symbol: "E£", country: "Egypt", isoCode: "EG", icon: flagEG },
  { label: "HKD", value: "HKD", symbol: "HK$", country: "Hong Kong", isoCode: "HK", icon: flagHK },
  { label: "ILS", value: "ILS", symbol: "₪", country: "Israel", isoCode: "IL", icon: flagIL },
  { label: "KRW", value: "KRW", symbol: "₩", country: "South Korea", isoCode: "KR", icon: flagKR },
  { label: "MAD", value: "MAD", symbol: "DH", country: "Morocco", isoCode: "MA", icon: flagMA },
  { label: "NZD", value: "NZD", symbol: "NZ$", country: "New Zealand", isoCode: "NZ", icon: flagNZ },
  { label: "RUB", value: "RUB", symbol: "₽", country: "Russia", isoCode: "RU", icon: flagRU },
  { label: "RWF", value: "RWF", symbol: "RF", country: "Rwanda", isoCode: "RW", icon: flagRW },
  { label: "SAR", value: "SAR", symbol: "ر.س", country: "Saudi Arabia", isoCode: "SA", icon: flagSA },
  { label: "SEK", value: "SEK", symbol: "kr", country: "Sweden", isoCode: "SE", icon: flagSE },
  { label: "SGD", value: "SGD", symbol: "S$", country: "Singapore", isoCode: "SG", icon: flagSG },
  { label: "TRY", value: "TRY", symbol: "₺", country: "Turkey", isoCode: "TR", icon: flagTR },
  { label: "TZS", value: "TZS", symbol: "TSh", country: "Tanzania", isoCode: "TZ", icon: flagTZ },
  { label: "UGX", value: "UGX", symbol: "USh", country: "Uganda", isoCode: "UG", icon: flagUG },
  { label: "XAF", value: "XAF", symbol: "FCFA", country: "Central Africa", isoCode: "CM", icon: flagCM },
  { label: "XOF", value: "XOF", symbol: "CFA", country: "West Africa", isoCode: "CI", icon: flagCI },
  { label: "Naira", value: "NGN", symbol: "₦", country: "Nigeria", isoCode: "NG", icon: Nigeria },
];

export const getCurrencySymbol = (code?: string) => {
  const currency = CURRENCIES.find(c => c.value === code);
  return currency ? currency.symbol : "₦";
};

export const getLanguageFlag = (code?: string) => {
  const lang = LANGUAGES.find(l => l.value === code);
  return lang ? lang.flag : ""; 
};
