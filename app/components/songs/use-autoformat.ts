import { useCallback, useEffect, useState, useRef } from "react";
import { useFetcher } from "react-router";
import { LyricsEditorHandle } from "./lyrics-editor";
import { toast } from "sonner";

const isOnboarded = () => localStorage.getItem("autoFormatOnboarded") === "1";
const setIsOnboarded = () => localStorage.setItem("autoFormatOnboarded", "1");

export default function useAutoFormat({
  lyricsRef,
  onChange,
  setIsDisabled,
}: {
  lyricsRef: React.RefObject<LyricsEditorHandle | null>;
  onChange: () => void;
  setIsDisabled: (value: boolean) => void;
}) {
  const fetcher = useFetcher();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const pendingOnboardingRef = useRef<(accepted: boolean) => void>(null);
  const acceptOnboarding = () => {
    setIsOnboardingOpen(false);
    pendingOnboardingRef.current?.(true);
  };
  const closeOnboarding = () => {
    setIsOnboardingOpen(false);
    pendingOnboardingRef.current?.(false);
  };

  const autoFormat = useCallback(async () => {
    if (!lyricsRef.current) {
      return;
    }

    if (!isOnboarded()) {
      const canContinuePromise = new Promise<boolean>((resolve) => {
        pendingOnboardingRef.current = resolve;
      });
      setIsOnboardingOpen(true);

      if (!(await canContinuePromise)) {
        return;
      }

      setIsOnboarded();
    }

    const body = new FormData();
    body.set("lyrics", lyricsRef.current.value);

    await fetcher.submit(body, {
      method: "post",
      action: "/dashboard/songs/autoformat",
    });
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
        const { formattedLyrics } = data;
        if (formattedLyrics !== lyricsRef.current.value) {
          lyricsRef.current.setValue(formattedLyrics);
          onChange();
        }
      }
    } else if (data.error === "tooLong") {
      toast.error("Podany tekst jest zbyt długi dla funkcji autoformatowania.");
    } else if (data.error === "limitExceeded") {
      toast.error(
        "Limit wykorzystania funkcji AI został przekroczony. Spróbuj ponownie w przyszłym tygodniu.",
      );
    } else {
      toast.error("Nie udało się wykonać automatycznego formatowania.");
    }
  }, [fetcher.data, lyricsRef, onChange]);

  return {
    autoFormat,
    isFetching,
    onboarding: {
      isOpen: isOnboardingOpen,
      onAccept: acceptOnboarding,
      onClose: closeOnboarding,
    },
  };
}
