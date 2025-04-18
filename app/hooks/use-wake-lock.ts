import { useState, useCallback } from "react";

export default function useWakeLock(): [
  WakeLockSentinel | null,
  () => Promise<void>,
] {
  const [wakeLock, setWakeLock] = useState<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    const newWakeLock = await navigator.wakeLock.request("screen");

    newWakeLock.addEventListener("release", () => {
      setWakeLock(null);
    });

    setWakeLock(newWakeLock);
  }, []);

  return [wakeLock, requestWakeLock];
}
