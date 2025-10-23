function categorizeColorSchemes(colorSchemes, requireAdjacency = false) {
  const areColorsEqual = (color1, color2) => color1.hex === color2.hex;

  function analyzeColorScheme(scheme) {
    const colors = Object.values(scheme.colors);
    const [tint1, tint2, tint3] = colors;

    if (areColorsEqual(tint1, tint2) && areColorsEqual(tint2, tint3)) {
      return 'allEqual';
    }

    if (requireAdjacency) {
      if (areColorsEqual(tint1, tint2) || areColorsEqual(tint2, tint3)) {
        return 'someEqual';
      }

      return 'noneEqual';
    } else {
      if (areColorsEqual(tint1, tint2) ||
        areColorsEqual(tint2, tint3) ||
        areColorsEqual(tint1, tint3)) {
        return 'someEqual';
      }
    }

    return 'noneEqual';
  }

  const categorized = {
    allEqual: [],
    someEqual: [],
    noneEqual: [],
  };

  colorSchemes.forEach(scheme => {
    const category = analyzeColorScheme(scheme);
    categorized[category].push(scheme);
  });

  return [
    ...categorized.allEqual,
    ...categorized.someEqual,
    ...categorized.noneEqual
  ];
}
