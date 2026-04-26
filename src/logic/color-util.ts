import type { ColorScheme, EqualityClass, SchemeColor } from './types';

export const areColorsEqual = (c1: SchemeColor, c2: SchemeColor): boolean => c1.hex === c2.hex;

export const getSchemePairs = (colors: SchemeColor[], requireAdjacency: boolean): [SchemeColor, SchemeColor][] => {
  const [t1, t2, t3] = colors;
  return requireAdjacency ? [[t1, t2], [t2, t3]] : [[t1, t2], [t2, t3], [t1, t3]];
};

export const classifyEquality = (matched: number, total: number): EqualityClass =>
  matched === total ? 'allEqual' : matched > 0 ? 'someEqual' : 'noneEqual';

export const classifyScheme = (scheme: ColorScheme, requireAdjacency: boolean): EqualityClass => {
  const pairs = getSchemePairs(Object.values(scheme.colors), requireAdjacency);
  const matched = pairs.filter(([a, b]) => areColorsEqual(a, b)).length;
  return classifyEquality(matched, pairs.length);
};

export const ColorUtil = {
  categorizeSchemes(colorSchemes: ColorScheme[], requireAdjacency = false): ColorScheme[] {
    const groups: Record<EqualityClass, ColorScheme[]> = { allEqual: [], someEqual: [], noneEqual: [] };
    colorSchemes.forEach((scheme) => groups[classifyScheme(scheme, requireAdjacency)].push(scheme));
    return [...groups.allEqual, ...groups.someEqual, ...groups.noneEqual];
  },
};
