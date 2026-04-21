import { useEffect, useState } from "react";

export function useTabLoader(activeTab) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 320);
    return () => window.clearTimeout(id);
  }, [activeTab]);

  return loading;
}
