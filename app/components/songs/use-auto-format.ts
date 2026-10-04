import { useCallback, useEffect } from "react";
import { useFetcher } from "react-router";
import { LyricsEditorHandle } from "./lyrics-editor";
import { toast } from "sonner";

export default function useAutoFormat({
  lyricsRef,
  setIsDisabled,
}: {
  lyricsRef: React.RefObject<LyricsEditorHandle | null>;
  setIsDisabled: (value: boolean) => void;
}) {
  const fetcher = useFetcher();

  const autoFormat = useCallback(async () => {
    if (!lyricsRef.current) {
      return;
    }

    const body = new FormData();
    body.set("lyrics", lyricsRef.current.value);

    try {
      await fetcher.submit(body, {
        method: "post",
        action: "/dashboard/songs/autoformat",
      });
    } catch (error) {
      console.log(error);
    }
  }, [fetcher, lyricsRef]);

  const isFetching = fetcher.state !== "idle";

  useEffect(() => {
    setIsDisabled(isFetching);
  }, [setIsDisabled, isFetching]);

  useEffect(() => {
    const data = fetcher.data;
    if (!data) {
      return;
    }

    if (data.ok) {
      if (lyricsRef.current && typeof data?.formattedLyrics === "string") {
        lyricsRef.current.setValue(fetcher.data.formattedLyrics);
      }
    } else if (data.error === "limitExceeded") {
      toast.error(
        "Limit wykorzystania funkcji AI został przekroczony. Spróbuj ponownie w przyszłym tygodniu.",
      );
    } else {
      toast.error("Nie udało się wykonać automatycznego formatowania.");
    }
  }, [fetcher.data, lyricsRef]);

  return { autoFormat, isFetching };
}
