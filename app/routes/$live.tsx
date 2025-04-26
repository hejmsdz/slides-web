import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import PdfPresentation from "~/components/pdf/pdf-presentation";
import useEventListener from "~/hooks/use-event-listener";
import useWakeLock from "~/hooks/use-wake-lock";

export async function loader({ params }: LoaderFunctionArgs) {
  return {
    eventSourceUrl: `${process.env.API_URL}/v2/live/${params.live}`,
  };
}

export const handle = {
  bodyClassName: "bg-black text-white",
};

type PresentationState = {
  url: string;
  currentPage: number;
};

const useSSE = (url: string): PresentationState | null => {
  const [data, setData] = useState<PresentationState | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(url);

    eventSource.addEventListener("start", (event) => {
      const { url, currentPage } = JSON.parse(event.data);
      setData({ url, currentPage });
    });

    eventSource.addEventListener("changePage", (event) => {
      const { page } = JSON.parse(event.data);
      setData((prevData) => prevData && { ...prevData, currentPage: page });
    });

    return () => {
      eventSource.close();
    };
  }, [url]);

  return data;
};

export default function Live() {
  const { eventSourceUrl } = useLoaderData<typeof loader>();
  const presentationState = useSSE(eventSourceUrl);

  const ref = useRef<HTMLDivElement>(null);
  const [wakeLock, requestWakeLock] = useWakeLock();

  const toggleFullscreen = useCallback(() => {
    console.log("toggleFullscreen", document.fullscreenElement);
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (ref.current) {
      requestWakeLock(); // Safari requires that wake lock is acquired directly from a user gesture handler

      ref.current.requestFullscreen({ navigationUI: "hide" });

      setTimeout(() => {
        requestWakeLock(); // Firefox on macOS releases the wake lock as you go full screen
      }, 1000);
    }
  }, [requestWakeLock]);

  // useEventListener("doubleclick", toggleFullscreen);
  useEffect(() => {
    console.log("adding doubleclick listener");
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

  if (!presentationState) {
    return null;
  }

  return (
    <PdfPresentation
      ref={ref}
      src={presentationState.url}
      page={presentationState.currentPage + 1}
    />
  );
}
