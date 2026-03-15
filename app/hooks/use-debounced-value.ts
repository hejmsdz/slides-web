import { useEffect, useState } from "react";
import useDebouncedCallback from "./use-debounced-callback";

export default function useDebouncedValue<T>(value: T, delay: number | undefined = undefined) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  const debouncedCallback = useDebouncedCallback((value: T) => {
    setDebouncedValue(value);
  }, delay);

  useEffect(() => {
    debouncedCallback(value);
  }, [value, debouncedCallback]);

  return debouncedValue;
}
