import { useCallback, useEffect, useState } from 'react';

export function useNotice() {
  const [notice, setNotice] = useState({ message: '', id: 0 });

  const showNotice = useCallback((text) => {
    setNotice({ message: String(text ?? ''), id: Date.now() + Math.random() });
  }, []);

  const clearNotice = useCallback(() => setNotice({ message: '', id: 0 }), []);

  useEffect(() => {
    if (!notice.message) return undefined;
    const timeout = window.setTimeout(() => {
      setNotice({ message: '', id: 0 });
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [notice.id, notice.message]);

  return { message: notice.message, showNotice, clearNotice };
}
