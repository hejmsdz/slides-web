import { useState, useRef, useEffect, useCallback } from "react";

const IDLE_TIME = 2000;

export default function useMouseIdle(): {
  isIdle: boolean;
  handleMouseMove: () => void;
} {
  const [isIdle, setIsIdle] = useState(false);
  const idleTimeout = useRef<ReturnType<typeof setTimeout>>();

  const handleMouseMove = useCallback(() => {
    setIsIdle(false);

    if (idleTimeout.current) {
      clearTimeout(idleTimeout.current);
    }

    idleTimeout.current = setTimeout(() => {
      setIsIdle(true);
    }, IDLE_TIME);
  }, []);

  useEffect(
    () => () => {
      if (idleTimeout.current) {
        clearTimeout(idleTimeout.current);
      }
    },
    [],
  );

  return { isIdle, handleMouseMove };
}
