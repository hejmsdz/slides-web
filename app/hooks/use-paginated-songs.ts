import { useCallback, useEffect, useState, useRef } from "react";
import { useFetcher } from "react-router";
import type { ServerData } from "~/routes/dashboard";
import type { loader as searchLoader } from "~/routes/dashboard.songs.search";
import { PAGE_SIZE } from "~/routes/dashboard.songs.search";
import type { Song } from "~/api/songs";

const copyItems = (
  sourceArray: Song[],
  destinationArray: Song[],
  offset: number = 0,
): Song[] => {
  for (let i = 0; i < sourceArray.length; i++) {
    destinationArray[offset + i] = sourceArray[i];
  }
  return destinationArray;
};

const buildSparseArrayFromFirstPage = (
  defaultSongs: ServerData["songs"],
): Song[] => copyItems(defaultSongs.items, new Array(defaultSongs.total));

export default function usePaginatedSongs(
  defaultSongs: ServerData["songs"],
  query: string,
) {
  const [allItems, setAllItems] = useState<Song[]>(() =>
    buildSparseArrayFromFirstPage(defaultSongs),
  );

  const fetcher = useFetcher<typeof searchLoader>();
  const [pagesToFetch, setPagesToFetch] = useState<number[]>([]);
  const pageCurrentlyFetchingRef = useRef<number | null>(null);

  const prevDataRef = useRef<
    Partial<{ defaultSongs: typeof defaultSongs; query: string }>
  >({});
  useEffect(() => {
    const prevData = prevDataRef.current;
    const isChange =
      Boolean(prevData.defaultSongs || prevData.query) &&
      (prevData.defaultSongs !== defaultSongs || prevData.query !== query);
    prevDataRef.current = { defaultSongs, query };
    if (!isChange) {
      return;
    }

    fetcher.reset();
    if (query === "") {
      setAllItems(buildSparseArrayFromFirstPage(defaultSongs));
      setPagesToFetch([]);
    } else {
      setPagesToFetch([0]);
    }
  }, [query, defaultSongs]); // eslint-disable-line react-hooks/exhaustive-deps

  const onNeedItems = useCallback((indices: number[]) => {
    const pagesNeeded = new Set(
      indices
        .map((index) => Math.floor(index / PAGE_SIZE))
        .filter((page) => page !== pageCurrentlyFetchingRef.current),
    );

    if (pagesNeeded.size > 0) {
      setPagesToFetch((prevValue) => [
        ...new Set([...prevValue, ...pagesNeeded]),
      ]);
    }
  }, []);

  useEffect(() => {
    if (
      pagesToFetch.length === 0 ||
      pageCurrentlyFetchingRef.current !== null
    ) {
      return;
    }

    const nextPage = pagesToFetch[0];
    pageCurrentlyFetchingRef.current = nextPage;
    fetcher.load(
      `/dashboard/songs/search?${new URLSearchParams({ ...(query && { query }), offset: `${nextPage * PAGE_SIZE}` })}`,
    );
  }, [pagesToFetch, fetcher, query]);

  useEffect(() => {
    if (
      pageCurrentlyFetchingRef.current === null ||
      fetcher.state !== "idle" ||
      !fetcher.data
    ) {
      return;
    }

    const pageFetched = pageCurrentlyFetchingRef.current;
    pageCurrentlyFetchingRef.current = null;
    const data = fetcher.data;

    setAllItems((prevValue) => {
      const newItems =
        prevValue.length === data.total
          ? prevValue.slice()
          : new Array(data.total);
      const offset = pageFetched * PAGE_SIZE;
      return copyItems(data.items, newItems, offset);
    });

    setPagesToFetch((prevValue) => prevValue.slice(1));
  }, [fetcher.state, fetcher.data]);

  return {
    songs: allItems,
    total: fetcher.data?.total ?? defaultSongs.total,
    onNeedItems,
  };
}
