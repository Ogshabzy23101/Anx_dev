import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return initialValue;

      const parsed = JSON.parse(stored);
      if (
        parsed &&
        initialValue &&
        typeof parsed === "object" &&
        typeof initialValue === "object" &&
        !Array.isArray(parsed)
      ) {
        return { ...initialValue, ...parsed };
      }

      return parsed;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
