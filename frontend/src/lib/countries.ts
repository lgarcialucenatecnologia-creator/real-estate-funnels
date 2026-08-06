export interface Country {
  /** Código ISO 3166-1 alpha-2. */
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  /** Cantidad de dígitos del número nacional, sin el prefijo. */
  minLength: number;
  maxLength: number;
  placeholder: string;
}

export const COUNTRIES: Country[] = [
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴", minLength: 10, maxLength: 10, placeholder: "300 123 4567" },
  { code: "US", name: "Estados Unidos", dialCode: "+1", flag: "🇺🇸", minLength: 10, maxLength: 10, placeholder: "305 123 4567" },
  { code: "MX", name: "México", dialCode: "+52", flag: "🇲🇽", minLength: 10, maxLength: 10, placeholder: "55 1234 5678" },
  { code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪", minLength: 10, maxLength: 10, placeholder: "412 123 4567" },
  { code: "ES", name: "España", dialCode: "+34", flag: "🇪🇸", minLength: 9, maxLength: 9, placeholder: "612 345 678" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷", minLength: 10, maxLength: 11, placeholder: "9 11 1234 5678" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱", minLength: 9, maxLength: 9, placeholder: "9 1234 5678" },
  { code: "PE", name: "Perú", dialCode: "+51", flag: "🇵🇪", minLength: 9, maxLength: 9, placeholder: "912 345 678" },
  { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨", minLength: 9, maxLength: 9, placeholder: "99 123 4567" },
  { code: "PA", name: "Panamá", dialCode: "+507", flag: "🇵🇦", minLength: 8, maxLength: 8, placeholder: "6123 4567" },
  { code: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷", minLength: 8, maxLength: 8, placeholder: "8312 3456" },
  { code: "DO", name: "República Dominicana", dialCode: "+1", flag: "🇩🇴", minLength: 10, maxLength: 10, placeholder: "809 123 4567" },
  { code: "GT", name: "Guatemala", dialCode: "+502", flag: "🇬🇹", minLength: 8, maxLength: 8, placeholder: "5123 4567" },
  { code: "SV", name: "El Salvador", dialCode: "+503", flag: "🇸🇻", minLength: 8, maxLength: 8, placeholder: "7123 4567" },
  { code: "HN", name: "Honduras", dialCode: "+504", flag: "🇭🇳", minLength: 8, maxLength: 8, placeholder: "9123 4567" },
  { code: "NI", name: "Nicaragua", dialCode: "+505", flag: "🇳🇮", minLength: 8, maxLength: 8, placeholder: "8123 4567" },
  { code: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴", minLength: 8, maxLength: 8, placeholder: "7123 4567" },
  { code: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾", minLength: 9, maxLength: 9, placeholder: "981 234 567" },
  { code: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾", minLength: 8, maxLength: 8, placeholder: "9123 4567" },
  { code: "BR", name: "Brasil", dialCode: "+55", flag: "🇧🇷", minLength: 10, maxLength: 11, placeholder: "11 91234 5678" },
  { code: "PR", name: "Puerto Rico", dialCode: "+1", flag: "🇵🇷", minLength: 10, maxLength: 10, placeholder: "787 123 4567" },
  { code: "CU", name: "Cuba", dialCode: "+53", flag: "🇨🇺", minLength: 8, maxLength: 8, placeholder: "5123 4567" },
  { code: "CA", name: "Canadá", dialCode: "+1", flag: "🇨🇦", minLength: 10, maxLength: 10, placeholder: "416 123 4567" },
  { code: "IT", name: "Italia", dialCode: "+39", flag: "🇮🇹", minLength: 9, maxLength: 10, placeholder: "312 345 6789" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹", minLength: 9, maxLength: 9, placeholder: "912 345 678" },
  { code: "FR", name: "Francia", dialCode: "+33", flag: "🇫🇷", minLength: 9, maxLength: 9, placeholder: "612 345 678" },
  { code: "DE", name: "Alemania", dialCode: "+49", flag: "🇩🇪", minLength: 10, maxLength: 11, placeholder: "1512 3456789" },
  { code: "GB", name: "Reino Unido", dialCode: "+44", flag: "🇬🇧", minLength: 10, maxLength: 10, placeholder: "7400 123456" },
];

export const DEFAULT_COUNTRY_CODE = "CO";

export const findCountry = (code: string): Country =>
  COUNTRIES.find((country) => country.code === code) ??
  COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY_CODE)!;
