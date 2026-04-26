const ColorConverter = {
  normalizeHSB(h, s, b) {
    const clamp = (value) => Math.min(100, Math.max(0, Math.round(value)));

    return {
      hue: ((h % 360) + 360) % 360,
      saturation: clamp(s),
      brightness: clamp(b)
    };
  },

  hsbToRgb(h, s, b) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    b = Math.max(0, Math.min(100, b)) / 100;

    let c = (1 - Math.abs(2 * b - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = b - c / 2;

    const sectors = [
      [c, x, 0], [x, c, 0], [0, c, x],
      [0, x, c], [x, 0, c], [c, 0, x],
    ];
    const [r, g, b1] = sectors[Math.floor(h / 60) % 6];

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b1 + m) * 255)
    ];
  },

  rgbToString(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  },

  snowRunnerFormat(r, g, b) {
    return `SnowRunner: g(${r}; ${g}; ${b})`;
  },

  getHueFromRGB(delta, max, r, g, b) {
    if (delta === 0) {
      return 0;
    }

    const raw = max === r
      ? ((g - b) / delta) % 6
      : max === g
        ? (b - r) / delta + 2
        : (r - g) / delta + 4;

    return (Math.round(raw * 60) + 360) % 360;
  },

  hexToHsb(hex) {
    hex = hex.replace('#', '');

    if (!/^([0-9a-fA-F]{6})$/.test(hex)) {
      throw new Error('Invalid HEX Color');
    }

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const h = this.getHueFromRGB(delta, max, r, g, b);
    const l = (max + min) / 2;
    const s = delta === 0 ? 0 : (delta / (1 - Math.abs(2 * l - 1))) * 100;
    const bValue = l * 100;

    return this.normalizeHSB(h, s, bValue);
  }
};
