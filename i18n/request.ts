import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";
import { locales, resolveLocale, type Locale } from "./detect";

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("NEXT_LOCALE")?.value;

  // Cookie wins; on first visit it isn't set yet, so detect from the header
  // so the initial server render already matches the visitor's language.
  const locale: Locale = locales.includes(cookieLocale as Locale)
    ? (cookieLocale as Locale)
    : resolveLocale((await headers()).get("accept-language"));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
