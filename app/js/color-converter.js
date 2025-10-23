const ColorConverter = {
  normalizeHSB(h, s, b) {
    return {
      hue: ((h % 360) + 360) % 360,
      saturation: Math.min(100, Math.max(0, s)),
      brightness: Math.min(100, Math.max(0, b))
    };
  },

  hsbToRgb(h, s, b) {
    h = ((h % 360) + 360) % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    b = Math.max(0, Math.min(100, b)) / 100;

    let c = (1 - Math.abs(2 * b - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = b - c / 2;

    let r, g, b1;
    const hi = Math.floor(h / 60) % 6;
    switch (hi) {
      case 0: [r, g, b1] = [c, x, 0]; break;
      case 1: [r, g, b1] = [x, c, 0]; break;
      case 2: [r, g, b1] = [0, c, x]; break;
      case 3: [r, g, b1] = [0, x, c]; break;
      case 4: [r, g, b1] = [x, 0, c]; break;
      case 5: [r, g, b1] = [c, 0, x]; break;
    }

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
  }
};
