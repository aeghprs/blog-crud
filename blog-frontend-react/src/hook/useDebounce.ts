import { useCallback, useEffect, useRef } from "react";

export function useDebounced<T, TArgs extends unknown[] = []>(
  callback: (value: T, ...args: TArgs) => void,
  delay = 800,
  transform: (value: T) => T = (value) => value,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounced = useCallback(
    (value: T, ...args: TArgs) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(transform(value), ...args);
      }, delay);
    },
    [callback, delay, transform],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debounced;
}
