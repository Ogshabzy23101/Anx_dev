import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue, migrate = (value) => value) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return migrate(initialValue);

      const parsed = JSON.parse(stored);
      if (
        parsed &&
        initialValue &&
        typeof parsed === "object" &&
        typeof initialValue === "object" &&
        !Array.isArray(parsed)
      ) {
        return migrate({ ...initialValue, ...parsed });
      }

      return migrate(parsed);
    } catch {
      return migrate(initialValue);
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(migrate(value)));
  }, [key, value, migrate]);

  return [value, setValue];
}
