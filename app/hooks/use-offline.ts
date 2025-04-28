import { useEffect, useState } from "react";

export default function useOffline() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);

    window.addEventListener("offline", () => setIsOffline(true));
    window.addEventListener("online", () => setIsOffline(false));
  }, []);

  return isOffline;
}
