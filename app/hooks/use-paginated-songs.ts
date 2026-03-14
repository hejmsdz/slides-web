import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";
import type { loader as searchLoader } from "~/routes/dashboard.songs.search";
import { PAGE_SIZE } from "~/routes/dashboard.songs.search";
import type { Song } from "~/api/songs";

function arrayToMap(array: Song[]) {
  return array.reduce((map, song, i) => map.set(i, song), new Map());
}

export default function usePaginatedSongs(defaultSongs: {
  items: Song[];
  total: number;
}) {
  const fetcher = useFetcher<typeof searchLoader>();

  const [songs, setSongs] = useState<Map<number, Song>>(
    () => arrayToMap(defaultSongs.items),
  );
  const [total, setTotal] = useState(defaultSongs.total);

  const queryRef = useRef("");
  const generationRef = useRef(0);
  // Tracks the in-flight request; null means nothing is in flight.
  // The gen field lets us discard responses that belong to a stale query.
  const inflightRef = useRef<{ page: number; gen: number } | null>(null);
  const requestedPagesRef = useRef<Set<number>>(new Set([0]));
  const pendingPagesRef = useRef<number[]>([]);

  const fetchPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams({ offset: `${page * PAGE_SIZE}` });
      if (queryRef.current) params.set("query", queryRef.current);
      inflightRef.current = { page, gen: generationRef.current };
      fetcher.load(`/dashboard/songs/search?${params}`);
    },
    [fetcher],
  );

  // Merge a completed page fetch into the map
  useEffect(() => {
    if (fetcher.state !== "idle" || !fetcher.data) return;
    if (inflightRef.current?.gen !== generationRef.current) return;

    const { page } = inflightRef.current;
    inflightRef.current = null;

    const { items, total: fetchedTotal } = fetcher.data;
    setTotal(fetchedTotal);
    setSongs((prev) => {
      const next = new Map(prev);
      (items as Song[]).forEach((song, i) => next.set(page * PAGE_SIZE + i, song));
      return next;
    });

    const nextPage = pendingPagesRef.current.shift();
    if (nextPage !== undefined) fetchPage(nextPage);
  }, [fetcher.state, fetcher.data, fetcher, fetchPage]);

  const handleQueryChange = useCallback(
    (query: string) => {
      queryRef.current = query;
      generationRef.current++;
      inflightRef.current = null;
      pendingPagesRef.current = [];

      if (query === "") {
        setSongs(arrayToMap(defaultSongs.items));
        setTotal(defaultSongs.total);
        requestedPagesRef.current = new Set([0]);
      } else {
        setSongs(new Map());
        setTotal(0);
        requestedPagesRef.current = new Set([0]);
        fetchPage(0);
      }
    },
    [defaultSongs, fetchPage],
  );

  // Reset when defaultSongs changes (e.g. team switch)
  const prevDefaultRef = useRef(defaultSongs);
  useEffect(() => {
    if (prevDefaultRef.current === defaultSongs) return;
    prevDefaultRef.current = defaultSongs;
    handleQueryChange("");
  }, [defaultSongs, handleQueryChange]);

  const handleNeedItems = useCallback(
    (indices: number[]) => {
      const pages = [...new Set(indices.map((i) => Math.floor(i / PAGE_SIZE)))];
      for (const page of pages) {
        if (requestedPagesRef.current.has(page)) continue;
        requestedPagesRef.current.add(page);
        if (fetcher.state === "idle" && pendingPagesRef.current.length === 0) {
          fetchPage(page);
        } else {
          pendingPagesRef.current.push(page);
        }
      }
    },
    [fetcher.state, fetchPage],
  );

  return { songs, total, handleQueryChange, handleNeedItems };
}
