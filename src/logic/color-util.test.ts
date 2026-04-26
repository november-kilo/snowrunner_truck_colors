import type { ColorScheme, SchemeColor } from './types';
import { areColorsEqual, getSchemePairs, classifyEquality, classifyScheme, ColorUtil } from './color-util';

const red: SchemeColor    = { hex: '#ff0000', hsb: { hue: 0,   saturation: 100, brightness: 50 } };
const green: SchemeColor  = { hex: '#00ff00', hsb: { hue: 120, saturation: 100, brightness: 50 } };
const blue: SchemeColor   = { hex: '#0000ff', hsb: { hue: 240, saturation: 100, brightness: 50 } };

const scheme = (t1: SchemeColor, t2: SchemeColor, t3: SchemeColor): ColorScheme => ({
  trucks: [],
  colors: { t1, t2, t3 },
});

describe('ColorUtil', () => {
  describe('areColorsEqual', () => {
    test('returns true for matching hex values', () => {
      expect(areColorsEqual(red, { hex: '#ff0000', hsb: red.hsb })).toBe(true);
    });

    test('returns false for different hex values', () => {
      expect(areColorsEqual(red, green)).toBe(false);
    });
  });

  describe('getSchemePairs', () => {
    test('returns all three pairs when requireAdjacency is false', () => {
      expect(getSchemePairs([red, green, blue], false)).toEqual([[red, green], [green, blue], [red, blue]]);
    });

    test('returns only adjacent pairs when requireAdjacency is true', () => {
      expect(getSchemePairs([red, green, blue], true)).toEqual([[red, green], [green, blue]]);
    });
  });

  describe('classifyEquality', () => {
    test('allEqual when matched equals total', () => {
      expect(classifyEquality(3, 3)).toBe('allEqual');
    });

    test('someEqual when matched is between 0 and total', () => {
      expect(classifyEquality(1, 3)).toBe('someEqual');
    });

    test('noneEqual when matched is 0', () => {
      expect(classifyEquality(0, 3)).toBe('noneEqual');
    });
  });

  describe('classifyScheme', () => {
    test('allEqual when all three colors match', () => {
      expect(classifyScheme(scheme(red, red, red), false)).toBe('allEqual');
    });

    test('someEqual when two colors match (non-adjacent)', () => {
      expect(classifyScheme(scheme(red, green, red), false)).toBe('someEqual');
    });

    test('noneEqual when no adjacent pair matches with requireAdjacency', () => {
      expect(classifyScheme(scheme(red, green, red), true)).toBe('noneEqual');
    });

    test('noneEqual when all colors differ', () => {
      expect(classifyScheme(scheme(red, green, blue), false)).toBe('noneEqual');
    });
  });

  describe('categorizeSchemes', () => {
    test('sorts allEqual before someEqual before noneEqual', () => {
      const none = scheme(red, green, blue);
      const some = scheme(red, red, blue);
      const all  = scheme(red, red, red);
      expect(ColorUtil.categorizeSchemes([none, some, all])).toEqual([all, some, none]);
    });

    test('preserves relative order within each category', () => {
      const scheme1 = scheme(red, green, blue);
      const scheme2 = scheme(green, red, blue);
      expect(ColorUtil.categorizeSchemes([scheme1, scheme2])).toEqual([scheme1, scheme2]);
    });

    test('non-adjacent match sorts before noneEqual without requireAdjacency', () => {
      const nonAdjacent = scheme(red, green, red);
      const noMatch     = scheme(red, green, blue);
      expect(ColorUtil.categorizeSchemes([noMatch, nonAdjacent], false)).toEqual([nonAdjacent, noMatch]);
    });

    test('non-adjacent match is ignored with requireAdjacency', () => {
      const nonAdjacent = scheme(red, green, red);
      const adjacent    = scheme(red, red, blue);
      expect(ColorUtil.categorizeSchemes([nonAdjacent, adjacent], true)).toEqual([adjacent, nonAdjacent]);
    });
  });
});
