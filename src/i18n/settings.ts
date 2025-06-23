export const fallbackLng = "en";
export const navLanguages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
];
export const languages = navLanguages.map((lang) => lang.code);
export const defaultNS = "common";
export const namespaces = [
  "about",
  "articles",
  "common",
  "home",
  "projects",
];
export const cookieName = "WPG_LANG";