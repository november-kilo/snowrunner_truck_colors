const ColorDescriptor = {
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

  describe(hue, saturation, brightness) {
    const color = ColorConverter.normalizeHSB(hue, saturation, brightness);

    const grayscale = this._checkGrayscale(color);
    if (grayscale) {
      return grayscale;
    }

    const extreme = this._checkExtremeBrightness(color);
    if (extreme) {
      return extreme;
    }

    const baseColor = this._getBaseColor(color.hue);
    const modifier = this._getVividness(color) || this._getIntensity(color);

    return `${modifier}${baseColor}`.trim();
  },

  _checkGrayscale({ saturation, brightness }) {
    if (saturation >= this.thresholds.grayscaleSaturation) {
      return null;
    }

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
    const t = this.thresholds;

    if (brightness < t.lowBrightness) {
      return "black";
    }

    if (brightness > t.highBrightness && saturation < t.lowSaturation) {
      return "white";
    }

    return null;
  },

  _getBaseColor(hue) {
    for (const [color, range] of Object.entries(this.colorRanges)) {
      if (color === 'RED' && (hue >= range.min || hue < range.max)) {
        return "red";
      }

      if (hue >= range.min && hue < range.max) {
        return color.toLowerCase();
      }
    }

    return "red";
  },

  _getIntensity({ brightness }) {
    const t = this.thresholds;

    if (brightness < t.lowBrightnessModifier) {
      return "dark ";
    }

    if (brightness > t.highBrightnessModifier) {
      return "bright ";
    }

    return "";
  },

  _getVividness({ saturation }) {
    const t = this.thresholds;

    if (saturation < t.lowSaturation) {
      return "pale ";
    }

    if (saturation > t.highSaturation) {
      return "vivid ";
    }

    return "";
  }
};
