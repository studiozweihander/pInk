export const APP_VERSION = "2.4.1";
export const CONTACT_EMAIL = "comics.pink@gmail.com";
export const PLACEHOLDER_IMAGE =
  "https://placehold.co/300x450/242424/e78fde?text=Imagem+Não+Disponível&font=source-sans-pro";
export const DEFAULT_OG_IMAGE =
  "https://placehold.co/1200x600/181818/e78fde?text=pInk&font=poppins";

export const getDynamicOGImage = (title: string, year: string | number) => {
  const text = encodeURIComponent(`${title} ${year} - pInk`);
  return `https://placehold.co/1200x600/181818/e78fde?text=${text}&font=poppins`;
};
export const SOCIAL_LINKS = {
  twitter: "https://x.com/pinkcomics",
} as const;

export const VIEW_MODES = {
  GRID: "grid",
  LIST: "list",
} as const;

export type ViewMode = (typeof VIEW_MODES)[keyof typeof VIEW_MODES];

export const FILTER_KEYS = {
  PUBLISHER: "publisher",
  YEAR: "year",
  LANGUAGE: "language",
} as const;

export type FilterKey = (typeof FILTER_KEYS)[keyof typeof FILTER_KEYS];

export type ActiveFilters = Record<FilterKey, string[]>;
