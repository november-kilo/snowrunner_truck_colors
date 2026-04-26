import { act, renderHook } from '@testing-library/react';
import { ClipboardProvider, useClipboard } from './ClipboardContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return <ClipboardProvider>{children}</ClipboardProvider>;
}

function stubClipboard(overrides: Partial<Clipboard>) {
  Object.defineProperty(navigator, 'clipboard', {
    value: {
      writeText: vi.fn().mockResolvedValue(undefined),
      readText: vi.fn().mockRejectedValue(new Error('denied')),
      ...overrides,
    },
    configurable: true,
  });
}

afterEach(() => {
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true });
});

test('useClipboard throws outside ClipboardProvider', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  expect(() => renderHook(() => useClipboard())).toThrow('useClipboard must be used within ClipboardProvider');
  spy.mockRestore();
});

test('paste returns value stored by copy via in-memory fallback', async () => {
  stubClipboard({});
  const { result } = renderHook(() => useClipboard(), { wrapper });

  await act(async () => {
    await result.current.copy({ hue: 120, saturation: 50, brightness: 75 });
  });

  expect(await result.current.paste()).toEqual({ hue: 120, saturation: 50, brightness: 75 });
});

test('paste returns system clipboard value when it contains valid HSB', async () => {
  const hsb = { hue: 240, saturation: 100, brightness: 80 };
  stubClipboard({ readText: vi.fn().mockResolvedValue(JSON.stringify(hsb)) });

  const { result } = renderHook(() => useClipboard(), { wrapper });

  expect(await result.current.paste()).toEqual(hsb);
});

test('paste throws when nothing stored and system clipboard fails', async () => {
  stubClipboard({});
  const { result } = renderHook(() => useClipboard(), { wrapper });

  await expect(result.current.paste()).rejects.toThrow('Nothing to paste');
});
