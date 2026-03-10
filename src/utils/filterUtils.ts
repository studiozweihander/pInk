import type { ActiveFilters } from "../constants";

interface FilterableBaseItem {
  title: string;
  year?: number | null;
  publisher?: string | null;
  language?: string | null;
}

interface FilterOptions {
  includePublisher: boolean;
  includeLanguage: boolean;
}

export const filterItemsBySearchAndFilters = <T extends FilterableBaseItem>(
  items: T[],
  searchTerm: string,
  activeFilters: ActiveFilters,
  options: FilterOptions,
): T[] => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return items.filter((item) => {
    const matchesSearch =
      normalizedSearch.length === 0 || item.title.toLowerCase().includes(normalizedSearch);

    if (!matchesSearch) {
      return false;
    }

    const yearFilters = activeFilters.year;
    if (yearFilters.length > 0) {
      const itemYear = item.year?.toString();
      if (!itemYear || !yearFilters.includes(itemYear)) {
        return false;
      }
    }

    if (options.includePublisher) {
      const publisherFilters = activeFilters.publisher;
      if (publisherFilters.length > 0) {
        if (!item.publisher || !publisherFilters.includes(item.publisher)) {
          return false;
        }
      }
    }

    if (options.includeLanguage) {
      const languageFilters = activeFilters.language;
      if (languageFilters.length > 0) {
        if (!item.language || !languageFilters.includes(item.language)) {
          return false;
        }
      }
    }

    return true;
  });
};
