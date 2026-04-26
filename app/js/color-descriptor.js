const THRESHOLDS = {
  grayscaleSaturation: 5,
  lowBrightness: 15,
  highBrightness: 85,
  lowSaturation: 25,
  highSaturation: 75,
  lowBrightnessModifier: 30,
  highBrightnessModifier: 65,
};

const COLOR_RANGES = [
  { name: 'red',     test: (h) => h >= 350 || h < 10  },
  { name: 'orange',  test: (h) => h >= 10  && h < 40  },
  { name: 'yellow',  test: (h) => h >= 40  && h < 70  },
  { name: 'green',   test: (h) => h >= 70  && h < 160 },
  { name: 'cyan',    test: (h) => h >= 160 && h < 200 },
  { name: 'blue',    test: (h) => h >= 200 && h < 260 },
  { name: 'purple',  test: (h) => h >= 260 && h < 290 },
  { name: 'magenta', test: (h) => h >= 290 && h < 350 },
];

const isGrayscale = (saturation) => saturation < THRESHOLDS.grayscaleSaturation;

const getGrayscaleName = brightness => {
  const shades = [
    { threshold: 15,  name: 'black'      },
    { threshold: 35,  name: 'dark gray'  },
    { threshold: 65,  name: 'gray'       },
    { threshold: 85,  name: 'light gray' },
    { threshold: 101, name: 'white'      },
  ];

  return shades.find((s) => brightness < s.threshold)?.name ?? 'white';
};

const isLowBrightness = (brightness) => brightness < THRESHOLDS.lowBrightness;
const isHighBrightness = (brightness, saturation) =>
  brightness > THRESHOLDS.highBrightness && saturation < THRESHOLDS.lowSaturation;

const getExtremeName = (brightness, saturation) => {
  if (isLowBrightness(brightness)) {
    return 'black';
  }

  if (isHighBrightness(brightness, saturation)) {
    return 'white';
  }

  return null;
};

const getBaseColorName = (hue) => COLOR_RANGES.find(r => r.test(hue))?.name ?? 'red';
const isPale = (saturation) => saturation < THRESHOLDS.lowSaturation;
const isVivid = (saturation) => saturation > THRESHOLDS.highSaturation;
const isDark = (brightness) => brightness < THRESHOLDS.lowBrightnessModifier;
const isBright = (brightness) => brightness > THRESHOLDS.highBrightnessModifier;

const getModifier = (saturation, brightness) => {
  if (isPale(saturation)) {
    return 'pale ';
  }

  if (isVivid(saturation)) {
    return 'vivid ';
  }

  if (isDark(brightness)) {
    return 'dark ';
  }

  if (isBright(brightness)) {
    return 'bright ';
  }

  return '';
};

const ColorDescriptor = {
  describe(hue, saturation, brightness) {
    const { hue: h, saturation: s, brightness: b } = ColorConverter.normalizeHSB(hue, saturation, brightness);

    if (isGrayscale(s)) {
      return getGrayscaleName(b);
    }

    const extreme = getExtremeName(b, s);
    if (extreme) {
      return extreme;
    }

    return `${getModifier(s, b)}${getBaseColorName(h)}`.trim();
  },
};
