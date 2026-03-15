import { useRef } from "react";

function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay = 300,
) {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

export default function useDebouncedCallback<
  T extends (...args: Parameters<T>) => void,
>(fn: T, delay = 300) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  return useRef(
    debounce((...args: Parameters<T>) => {
      fnRef.current(...args);
    }, delay),
  ).current;
}
