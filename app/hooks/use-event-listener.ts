import { useEffect } from "react";

export default function useEventListener(
  eventName: string,
  handler: (event: Event) => void,
  target?: EventTarget,
) {
  useEffect(() => {
    const targetFallback = target ?? window;

    targetFallback.addEventListener(eventName, handler);

    return () => {
      targetFallback.removeEventListener(eventName, handler);
    };
  }, [eventName, handler, target]);
}
