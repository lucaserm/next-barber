export const locales = ["en", "pt-br"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Picks a supported locale from an Accept-Language header. Portuguese only if
// the primary subtag is "pt", otherwise the English default.
export function resolveLocale(acceptLanguage: string | null): Locale {
  const primary = acceptLanguage?.split(",")[0]?.trim().split("-")[0]?.toLowerCase();
  return primary === "pt" ? "pt-br" : defaultLocale;
}
