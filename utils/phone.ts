export const COUNTRY_PHONE_CODES: Record<string, string> = {
  Nigeria: "+234",
  "United Kingdom": "+44",
  "United States": "+1",
  USA: "+1",
  Ghana: "+233",
  Kenya: "+254",
  Canada: "+1",
  Australia: "+61",
  Germany: "+49",
  France: "+33",
  India: "+91",
  "South Africa": "+27",
  UAE: "+971",
};

export const getPhoneCodeByCountry = (country?: string): string => {
  if (!country) return "+234"; // Default
  return COUNTRY_PHONE_CODES[country] || "+234";
};
