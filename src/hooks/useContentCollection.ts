import { useMemo } from "react";

type OrderDirection = "asc" | "desc";

type CollectionOptions = {
  orderBy?: {
    field: string;
    direction?: OrderDirection;
  };
  where?: {
    field: string;
    operator: string;
    value: unknown;
  };
  limit?: number;
};

export type ContentCollectionResult<T> = {
  data: T[];
  isLoading: boolean;
  error: Error | null;
  isUsingFallback: boolean;
};

/**
 * Local-data collection hook.
 *
 * This replaces the former remote backend implementation. Content is served
 * from bundled static data until the Spring Boot content module
 * (/api/v1/content/**) goes live, at which point this hook becomes a thin
 * fetch wrapper over that API while keeping the same call signature.
 */
export const useContentCollection = <T extends Record<string, unknown>>(
  _collectionName: string,
  fallbackData: T[] = [],
  _options?: CollectionOptions,
): ContentCollectionResult<T> => {
  return useMemo<ContentCollectionResult<T>>(
    () => ({
      data: fallbackData,
      isLoading: false,
      error: null,
      isUsingFallback: true,
    }),
    [fallbackData],
  );
};
