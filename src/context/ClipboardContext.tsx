import { createContext, useCallback, useContext, useMemo, useReducer } from 'react';
import type { HSB } from '../logic/types';

interface ClipboardContextValue {
  copy: (hsb: HSB) => Promise<void>;
  paste: () => Promise<HSB>;
}

type ClipboardAction = { type: 'store'; payload: HSB };

function clipboardReducer(_state: HSB | null, action: ClipboardAction): HSB | null {
  switch (action.type) {
    case 'store': return action.payload;
  }
}

const ClipboardContext = createContext<ClipboardContextValue | null>(null);

export function ClipboardProvider({ children }: { children: React.ReactNode }) {
  const [stored, dispatch] = useReducer(clipboardReducer, null);

  const copy = useCallback(async (hsb: HSB): Promise<void> => {
    dispatch({ type: 'store', payload: hsb });
    try { await navigator.clipboard.writeText(JSON.stringify(hsb)); } catch (_) {}
  }, []);

  const paste = useCallback(async (): Promise<HSB> => {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (parsed.hue !== undefined && parsed.saturation !== undefined && parsed.brightness !== undefined) {
        return parsed as HSB;
      }
    } catch (_) {}
    if (stored) return stored;
    throw new Error('Nothing to paste');
  }, [stored]);

  const value = useMemo(() => ({ copy, paste }), [copy, paste]);

  return (
    <ClipboardContext.Provider value={value}>
      {children}
    </ClipboardContext.Provider>
  );
}

export function useClipboard(): ClipboardContextValue {
  const ctx = useContext(ClipboardContext);
  if (!ctx) throw new Error('useClipboard must be used within ClipboardProvider');
  return ctx;
}
