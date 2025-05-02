import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfPresentation from "~/components/pdf/pdf-presentation";
import useEventListener from "~/hooks/use-event-listener";
import useWakeLock from "~/hooks/use-wake-lock";
import "~/styles/presentation.css";
import useOffline from "~/hooks/use-offline";
import useMouseIdle from "~/hooks/use-mouse-idle";
import { cn } from "~/lib/utils";
import Spinner from "~/components/spinner";
import { getLiveStatus } from "~/api/live";
import { defaultApi } from "~/api/api";

const validLiveKeyRegex = /^\d{4}$/;

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.live || !validLiveKeyRegex.test(params.live)) {
    throw new Response("Not found", { status: 404 });
  }

  try {
    const { url, currentPage } = await getLiveStatus(defaultApi, params.live);

    return {
      url,
      currentPage,
      eventSourceUrl: new URL(
        `/v2/live/${params.live}`,
        process.env.EXTERNAL_API_URL,
      ).toString(),
    };
  } catch (error) {
    console.error(error);
    throw new Response("Not found", { status: 404 });
  }
}

type PresentationState = {
  url: string;
  currentPage: number;
};

type SSEResult = {
  data: PresentationState | null;
  isConnected: boolean | null;
};

const useSSE = (url: string): SSEResult => {
  const initialState = useLoaderData<typeof loader>();
  const [data, setData] = useState<PresentationState | null>(initialState);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.addEventListener("open", () => {
      setIsConnected(true);
    });

    eventSource.addEventListener("start", (event) => {
      const { url, currentPage } = JSON.parse(event.data);
      setData({ url, currentPage });
    });

    eventSource.addEventListener("changePage", (event) => {
      const { page } = JSON.parse(event.data);
      setData((prevData) => prevData && { ...prevData, currentPage: page });
    });

    eventSource.addEventListener("error", () => {
      setIsConnected(false);
    });

    return () => {
      eventSource.close();
    };
  }, [url]);

  return { data, isConnected };
};

export default function Live() {
  const { eventSourceUrl } = useLoaderData<typeof loader>();
  const { data: presentationState, isConnected } = useSSE(eventSourceUrl);
  const isOffline = useOffline();

  const presentationRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [wakeLock, requestWakeLock] = useWakeLock();
  const { isIdle, handleMouseMove } = useMouseIdle();

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (presentationRef.current) {
      requestWakeLock(); // Safari requires that wake lock is acquired directly from a user gesture handler

      presentationRef.current?.requestFullscreen({ navigationUI: "hide" });

      setTimeout(() => {
        requestWakeLock(); // Firefox on macOS releases the wake lock as you go full screen
      }, 1000);
    }
  }, [requestWakeLock]);

  useEffect(() => {
    document.body.addEventListener("dblclick", toggleFullscreen);

    return () => {
      document.body.removeEventListener("dblclick", toggleFullscreen);
    };
  }, [toggleFullscreen]);

  useEventListener("fullscreenchange", async () => {
    if (document.fullscreenElement) {
      try {
        await requestWakeLock();
      } catch (error) {
        console.warn("Error requesting wake lock", error);
      }

      try {
        await screen.orientation.lock("landscape");
      } catch (error) {
        console.warn("Error locking orientation", error);
      }
    } else {
      try {
        await wakeLock?.release();
      } catch (error) {
        console.warn("Error releasing wake lock", error);
      }

      try {
        await screen.orientation.unlock();
      } catch (error) {
        console.warn("Error unlocking orientation", error);
      }
    }
  });

  useEventListener("keydown", (event) => {
    const letter = (event as KeyboardEvent).key.toLowerCase();

    if (letter === "f") {
      toggleFullscreen();
    } else if (letter === "d") {
      linkRef.current?.click();
    }
  });

  if (!presentationState) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        {isConnected === null && <Spinner />}
      </div>
    );
  }

  const page = isConnected && !isOffline ? presentationState.currentPage : 0;

  return (
    <>
      <PdfPresentation
        ref={presentationRef}
        src={presentationState.url}
        page={page + 1}
        onMouseMove={handleMouseMove}
        className={cn({ "cursor-none": isIdle })}
      />
      <a className="hidden" href={presentationState.url} ref={linkRef}>
        {presentationState.url}
      </a>
    </>
  );
}
