const Config = {
  controls: ['hue', 'saturation', 'brightness'],
  sections: [1, 2, 3],
  defaults: {
    hue: 180,
    saturation: 50,
    brightness: 50
  },
  classes: {
    container: 'h-[100px] w-[100px] rounded-lg overflow-hidden flex flex-col border border-gray-200 cursor-pointer',
    section: 'h-1/3',
    sortingLabel: 'mr-2',
    sortingSelect: 'border rounded p-1'
  },
  thresholds: {
    grayscaleSaturation: 5,
    lowBrightness: 15,
    highBrightness: 85,
    lowSaturation: 25,
    highSaturation: 75,
    lowBrightnessModifier: 30,
    highBrightnessModifier: 65
  },
  colorRanges: {
    RED: { min: 350, max: 10 },
    ORANGE: { min: 10, max: 40 },
    YELLOW: { min: 40, max: 70 },
    GREEN: { min: 70, max: 160 },
    CYAN: { min: 160, max: 200 },
    BLUE: { min: 200, max: 260 },
    PURPLE: { min: 260, max: 290 },
    MAGENTA: { min: 290, max: 350 }
  },
  sortingOptions: [
    { value: 'hue', text: 'Hue' },
    { value: 'brightness', text: 'Brightness' },
    { value: 'similarity', text: 'Color Similarity' },
    { value: 'enhancedSimilarity', text: 'Enhanced Similarity' },
    { value: 'scheme', text: 'Color Scheme' },
    { value: 'enhancedScheme', text: 'Enhanced Color Scheme' }
  ]
};

const ColorDescriptor = {
  describe(hue, saturation, brightness) {
    const color = ColorConverter.normalizeHSB(hue, saturation, brightness);

    const grayscale = this._checkGrayscale(color);
    if (grayscale) return grayscale;

    const extreme = this._checkExtremeBrightness(color);
    if (extreme) return extreme;

    const baseColor = this._getBaseColor(color.hue);
    const intensity = this._getIntensity(color);
    const vividness = this._getVividness(color);

    return `${intensity}${vividness}${baseColor}`.trim();
  },

  _checkGrayscale({ saturation, brightness }) {
    if (saturation >= Config.thresholds.grayscaleSaturation) return null;

    const shades = [
      { threshold: 15, name: "black" },
      { threshold: 35, name: "dark gray" },
      { threshold: 65, name: "gray" },
      { threshold: 85, name: "light gray" },
      { threshold: 101, name: "white" }
    ];

    return shades.find(shade => brightness < shade.threshold)?.name || "white";
  },

  _checkExtremeBrightness({ brightness, saturation }) {
    const t = Config.thresholds;
    if (brightness < t.lowBrightness) return "black";
    if (brightness > t.highBrightness && saturation < t.lowSaturation) return "white";
    return null;
  },

  _getBaseColor(hue) {
    for (const [color, range] of Object.entries(Config.colorRanges)) {
      if (color === 'RED' && (hue >= range.min || hue < range.max)) return "red";
      if (hue >= range.min && hue < range.max) return color.toLowerCase();
    }
    return "red";
  },

  _getIntensity({ brightness }) {
    const t = Config.thresholds;
    if (brightness < t.lowBrightnessModifier) return "dark ";
    if (brightness > t.highBrightnessModifier) return "bright ";
    return "";
  },

  _getVividness({ saturation }) {
    const t = Config.thresholds;
    if (saturation < t.lowSaturation) return "pale ";
    if (saturation > t.highSaturation) return "vivid ";
    return "";
  }
};

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

  rgbStringToHsb(rgbStr) {
    const [r, g, b] = this.snowRunnerToRgb(rgbStr);
    const rr = r / 255;
    const gg = g / 255;
    const bb = b / 255;

    const max = Math.max(rr, gg, bb);
    const min = Math.min(rr, gg, bb);
    const delta = max - min;

    const lightness = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
    let hue;
    if (delta === 0) {
      hue = 0;
    } else if (max === rr) {
      hue = 60 * (((gg - bb) / delta) % 6);
    } else if (max === gg) {
      hue = 60 * ((bb - rr) / delta + 2);
    } else {
      hue = 60 * ((rr - gg) / delta + 4);
    }
    hue = ((hue % 360) + 360) % 360;

    return {
      hue: Math.round(hue),
      saturation: Math.round(saturation * 100),
      brightness: Math.round(lightness * 100)
    };
  },

  rgbToString(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  },

  snowRunnerFormat(r, g, b) {
    return `g(${r}; ${g}; ${b})`;
  },

  snowRunnerToRgb(snowRunnerColor) {
    const matches = snowRunnerColor.match(/g\((\d+);\s*(\d+);\s*(\d+)\)/);
    if (!matches) return [0, 0, 0];
    return matches.slice(1).map(n => parseInt(n));
  }
};

const ColorHarmony = {
  _generateColorInfo(hue, saturation, brightness) {
    const rgb = ColorConverter.hsbToRgb(hue, saturation, brightness);
    return {
      description: ColorDescriptor.describe(hue, saturation, brightness),
      snowrunner: ColorConverter.snowRunnerFormat(...rgb),
      rgb: ColorConverter.rgbToString(...rgb),
      hex: this._rgbToHex(...rgb),
      hsb: { hue, saturation, brightness }
    };
  },

  _rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  analogous(hue, saturation, brightness) {
    return [
      this._generateColorInfo((hue - 30 + 360) % 360, saturation, brightness),
      this._generateColorInfo(hue, saturation, brightness),
      this._generateColorInfo((hue + 30) % 360, saturation, brightness)
    ];
  },

  triadic(hue, saturation, brightness) {
    return [
      this._generateColorInfo(hue, saturation, brightness),
      this._generateColorInfo((hue + 120) % 360, saturation, brightness),
      this._generateColorInfo((hue + 240) % 360, saturation, brightness)
    ];
  },

  complementary(hue, saturation, brightness) {
    return [
      this._generateColorInfo(hue, saturation, brightness),
      this._generateColorInfo((hue + 180) % 360, saturation, brightness)
    ];
  },

  splitComplementary(hue, saturation, brightness) {
    const complement = (hue + 180) % 360;
    return [
      this._generateColorInfo(hue, saturation, brightness),
      this._generateColorInfo((complement - 30 + 360) % 360, saturation, brightness),
      this._generateColorInfo((complement + 30) % 360, saturation, brightness)
    ];
  },

  square(hue, saturation, brightness) {
    return [
      this._generateColorInfo(hue, saturation, brightness),
      this._generateColorInfo((hue + 90) % 360, saturation, brightness),
      this._generateColorInfo((hue + 180) % 360, saturation, brightness),
      this._generateColorInfo((hue + 270) % 360, saturation, brightness)
    ];
  },

  _createPreview(hsb) {
    const container = DOM.create('div');
    container.className = 'flex flex-col items-center';

    const colorSquare = DOM.create('div');
    colorSquare.className = 'w-16 h-16 rounded-lg mb-2';
    const [r, g, b] = ColorConverter.hsbToRgb(hsb.hue, hsb.saturation, hsb.brightness);
    colorSquare.style.backgroundColor = ColorConverter.rgbToString(r, g, b);
    colorSquare.title = ColorDescriptor.describe(hsb.hue, hsb.saturation, hsb.brightness);

    const hsbValues = DOM.create('div');
    hsbValues.className = 'text-xs text-gray-600 text-center';
    hsbValues.innerHTML = `
      <div>H: ${Math.round(hsb.hue)}°</div>
      <div>S: ${Math.round(hsb.saturation)}%</div>
      <div>B: ${Math.round(hsb.brightness)}%</div>
    `;

    DOM.appendTo(container, colorSquare);
    DOM.appendTo(container, hsbValues);
    return container;
  }
};

module.exports = {
  ColorConverter,
  ColorDescriptor,
  ColorHarmony
}
