const areColorsEqual = (c1, c2) => c1.hex === c2.hex;

const getSchemePairs = (colors, requireAdjacency) => {
  const [t1, t2, t3] = colors;

  return requireAdjacency ? [[t1, t2], [t2, t3]] : [[t1, t2], [t2, t3], [t1, t3]];
};

const classifyEquality = (matched, total) =>
  matched === total
    ? 'allEqual'
    : matched > 0
      ? 'someEqual'
      : 'noneEqual';

const classifyScheme = (scheme, requireAdjacency) => {
  const pairs = getSchemePairs(Object.values(scheme.colors), requireAdjacency);
  const matched = pairs.filter(([a, b]) => areColorsEqual(a, b)).length;

  return classifyEquality(matched, pairs.length);
};

const ColorUtil = {
  categorizeSchemes(colorSchemes, requireAdjacency = false) {
    const groups = { allEqual: [], someEqual: [], noneEqual: [] };

    colorSchemes.forEach((scheme) => groups[classifyScheme(scheme, requireAdjacency)].push(scheme));

    return [...groups.allEqual, ...groups.someEqual, ...groups.noneEqual];
  }
};
