// copy() always succeeds via in-memory store and best-efforts the system
// clipboard. paste() tries system clipboard first (works on localhost/https),
// then falls back to the in-memory store.
const HsbClipboard = {
  _stored: null,

  async copy(hsb) {
    this._stored = hsb;
    try { await navigator.clipboard.writeText(JSON.stringify(hsb)); } catch (_) {}
  },

  async paste() {
    try {
      const text = await navigator.clipboard.readText();
      const parsed = JSON.parse(text);
      if (parsed.hue !== undefined && parsed.saturation !== undefined && parsed.brightness !== undefined) {
        return parsed;
      }
    } catch (_) {}
    if (this._stored) return this._stored;
    throw new Error('Nothing to paste');
  },
};
