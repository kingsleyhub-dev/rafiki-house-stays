// Maps country names to ISO 3166-1 alpha-2 codes for flag emoji generation
const countryToCode: Record<string, string> = {
  'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'argentina': 'AR',
  'australia': 'AU', 'austria': 'AT', 'bangladesh': 'BD', 'belgium': 'BE',
  'brazil': 'BR', 'canada': 'CA', 'chile': 'CL', 'china': 'CN',
  'colombia': 'CO', 'croatia': 'HR', 'czech republic': 'CZ', 'czechia': 'CZ',
  'denmark': 'DK', 'egypt': 'EG', 'ethiopia': 'ET', 'finland': 'FI',
  'france': 'FR', 'germany': 'DE', 'ghana': 'GH', 'greece': 'GR',
  'hungary': 'HU', 'india': 'IN', 'indonesia': 'ID', 'iran': 'IR',
  'iraq': 'IQ', 'ireland': 'IE', 'israel': 'IL', 'italy': 'IT',
  'jamaica': 'JM', 'japan': 'JP', 'jordan': 'JO', 'kenya': 'KE',
  'south korea': 'KR', 'korea': 'KR', 'kuwait': 'KW', 'lebanon': 'LB',
  'malaysia': 'MY', 'mexico': 'MX', 'morocco': 'MA', 'mozambique': 'MZ',
  'nepal': 'NP', 'netherlands': 'NL', 'new zealand': 'NZ', 'nigeria': 'NG',
  'norway': 'NO', 'oman': 'OM', 'pakistan': 'PK', 'peru': 'PE',
  'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT', 'qatar': 'QA',
  'romania': 'RO', 'russia': 'RU', 'rwanda': 'RW', 'saudi arabia': 'SA',
  'senegal': 'SN', 'singapore': 'SG', 'south africa': 'ZA', 'spain': 'ES',
  'sri lanka': 'LK', 'sudan': 'SD', 'sweden': 'SE', 'switzerland': 'CH',
  'tanzania': 'TZ', 'thailand': 'TH', 'turkey': 'TR', 'turkiye': 'TR',
  'uganda': 'UG', 'ukraine': 'UA', 'united arab emirates': 'AE', 'uae': 'AE',
  'united kingdom': 'GB', 'uk': 'GB', 'united states': 'US', 'usa': 'US',
  'united states of america': 'US', 'vietnam': 'VN', 'zambia': 'ZM',
  'zimbabwe': 'ZW', 'somali': 'SO', 'somalia': 'SO', 'congo': 'CD',
  'cameroon': 'CM', 'ivory coast': 'CI', 'mali': 'ML', 'niger': 'NE',
  'togo': 'TG', 'benin': 'BJ', 'burkina faso': 'BF', 'guinea': 'GN',
  'liberia': 'LR', 'sierra leone': 'SL', 'gabon': 'GA', 'botswana': 'BW',
  'namibia': 'NA', 'madagascar': 'MG', 'mauritius': 'MU', 'seychelles': 'SC',
  'eritrea': 'ER', 'djibouti': 'DJ', 'comoros': 'KM', 'burundi': 'BI',
  'malawi': 'MW', 'angola': 'AO', 'tunisia': 'TN', 'libya': 'LY',
};

/**
 * Converts a two-letter country code to a flag emoji.
 * Uses regional indicator symbols (Unicode).
 */
function codeToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65))
    .join('');
}

/**
 * Returns the flag emoji for a given country name.
 * Returns null if the country is not recognized.
 */
export function getCountryFlag(country: string | null | undefined): string | null {
  if (!country) return null;
  const normalized = country.trim().toLowerCase();
  const code = countryToCode[normalized];
  if (!code) return null;
  return codeToFlagEmoji(code);
}
