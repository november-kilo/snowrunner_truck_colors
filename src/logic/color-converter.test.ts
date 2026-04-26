import { ColorConverter } from './color-converter';

describe('ColorConverter', () => {
  describe('normalizeHSB', () => {
    test('passes through in-range values unchanged', () => {
      expect(ColorConverter.normalizeHSB(180, 50, 75)).toEqual({ hue: 180, saturation: 50, brightness: 75 });
    });

    test('wraps hue above 360', () => {
      expect(ColorConverter.normalizeHSB(400, 50, 50)).toEqual({ hue: 40, saturation: 50, brightness: 50 });
    });

    test('wraps negative hue', () => {
      expect(ColorConverter.normalizeHSB(-30, 50, 50)).toEqual({ hue: 330, saturation: 50, brightness: 50 });
    });

    test('rounds saturation to nearest integer', () => {
      expect(ColorConverter.normalizeHSB(0, 50.4, 0).saturation).toBe(50);
      expect(ColorConverter.normalizeHSB(0, 50.5, 0).saturation).toBe(51);
      expect(ColorConverter.normalizeHSB(0, 50.6, 0).saturation).toBe(51);
    });

    test('rounds brightness to nearest integer', () => {
      expect(ColorConverter.normalizeHSB(0, 0, 50.4).brightness).toBe(50);
      expect(ColorConverter.normalizeHSB(0, 0, 50.5).brightness).toBe(51);
      expect(ColorConverter.normalizeHSB(0, 0, 50.6).brightness).toBe(51);
    });

    test('clamps saturation above 100', () => {
      expect(ColorConverter.normalizeHSB(0, 150, 50).saturation).toBe(100);
    });

    test('clamps saturation below 0', () => {
      expect(ColorConverter.normalizeHSB(0, -10, 50).saturation).toBe(0);
    });

    test('clamps brightness above 100', () => {
      expect(ColorConverter.normalizeHSB(0, 50, 110).brightness).toBe(100);
    });

    test('clamps brightness below 0', () => {
      expect(ColorConverter.normalizeHSB(0, 50, -5).brightness).toBe(0);
    });
  });

  describe('hsbToRgb', () => {
    let brightnessMidpoint: number;

    beforeEach(() => {
      brightnessMidpoint = 50;
    });

    test('sector 0: red (h=0)', () => {
      expect(ColorConverter.hsbToRgb(0, 100, brightnessMidpoint)).toEqual([255, 0, 0]);
    });

    test('sector 1: yellow (h=60)', () => {
      expect(ColorConverter.hsbToRgb(60, 100, brightnessMidpoint)).toEqual([255, 255, 0]);
    });

    test('sector 2: green (h=120)', () => {
      expect(ColorConverter.hsbToRgb(120, 100, brightnessMidpoint)).toEqual([0, 255, 0]);
    });

    test('sector 3: cyan (h=180)', () => {
      expect(ColorConverter.hsbToRgb(180, 100, brightnessMidpoint)).toEqual([0, 255, 255]);
    });

    test('sector 4: blue (h=240)', () => {
      expect(ColorConverter.hsbToRgb(240, 100, brightnessMidpoint)).toEqual([0, 0, 255]);
    });

    test('sector 5: magenta (h=300)', () => {
      expect(ColorConverter.hsbToRgb(300, 100, brightnessMidpoint)).toEqual([255, 0, 255]);
    });

    test('white (s=0, b=100)', () => {
      expect(ColorConverter.hsbToRgb(0, 0, 100)).toEqual([255, 255, 255]);
    });

    test('black (b=0)', () => {
      expect(ColorConverter.hsbToRgb(0, 0, 0)).toEqual([0, 0, 0]);
    });
  });

  describe('rgbToString', () => {
    test('formats as rgb()', () => {
      expect(ColorConverter.rgbToString(255, 128, 0)).toBe('rgb(255, 128, 0)');
    });
  });

  describe('snowRunnerFormat', () => {
    test('formats with semicolon separators', () => {
      expect(ColorConverter.snowRunnerFormat(255, 128, 0)).toBe('SnowRunner: g(255; 128; 0)');
    });
  });

  describe('getHueFromRGB', () => {
    test('returns 0 when delta is 0 (achromatic)', () => {
      expect(ColorConverter.getHueFromRGB(0, 0.5, 0.5, 0.5, 0.5)).toBe(0);
    });

    test('computes hue when green is max', () => {
      expect(ColorConverter.getHueFromRGB(1, 1, 0, 1, 0)).toBe(120);
    });

    test('wraps negative raw hue when blue > green with red max', () => {
      expect(ColorConverter.getHueFromRGB(1, 1, 1, 0, 1)).toBe(300);
    });
  });

  describe('hexToHsb', () => {
    test('converts red', () => {
      expect(ColorConverter.hexToHsb('#ff0000')).toEqual({ hue: 0, saturation: 100, brightness: 50 });
    });

    test('converts green', () => {
      expect(ColorConverter.hexToHsb('#00ff00')).toEqual({ hue: 120, saturation: 100, brightness: 50 });
    });

    test('converts blue', () => {
      expect(ColorConverter.hexToHsb('#0000ff')).toEqual({ hue: 240, saturation: 100, brightness: 50 });
    });

    test('converts white', () => {
      expect(ColorConverter.hexToHsb('#ffffff')).toEqual({ hue: 0, saturation: 0, brightness: 100 });
    });

    test('converts black', () => {
      expect(ColorConverter.hexToHsb('#000000')).toEqual({ hue: 0, saturation: 0, brightness: 0 });
    });

    test('accepts hex without leading #', () => {
      expect(ColorConverter.hexToHsb('ff0000')).toEqual({ hue: 0, saturation: 100, brightness: 50 });
    });

    test('accepts uppercase hex', () => {
      expect(ColorConverter.hexToHsb('#FF0000')).toEqual({ hue: 0, saturation: 100, brightness: 50 });
    });

    test('throws on invalid hex', () => {
      expect(() => ColorConverter.hexToHsb('#xyz')).toThrow(/Invalid HEX Color/);
    });
  });
});
