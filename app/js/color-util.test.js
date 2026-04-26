const red = { hex: '#ff0000' };
const green = { hex: '#00ff00' };
const blue = { hex: '#0000ff' };

const scheme = (t1, t2, t3) => ({ colors: { t1, t2, t3 } });

QUnit.module('areColorsEqual', () => {
  QUnit.test('returns true for matching hex values', (assert) => {
    assert.true(areColorsEqual(red, { hex: '#ff0000' }));
  });

  QUnit.test('returns false for different hex values', (assert) => {
    assert.false(areColorsEqual(red, green));
  });
});

QUnit.module('getSchemePairs', () => {
  QUnit.test('returns all three pairs when requireAdjacency is false', (assert) => {
    const pairs = getSchemePairs([red, green, blue], false);

    assert.deepEqual(pairs, [[red, green], [green, blue], [red, blue]]);
  });

  QUnit.test('returns only adjacent pairs when requireAdjacency is true', (assert) => {
    const pairs = getSchemePairs([red, green, blue], true);

    assert.deepEqual(pairs, [[red, green], [green, blue]]);
  });
});

QUnit.module('classifyEquality', () => {
  QUnit.test('allEqual when matched equals total', (assert) => {
    assert.equal(classifyEquality(3, 3), 'allEqual');
  });

  QUnit.test('someEqual when matched is between 0 and total', (assert) => {
    assert.equal(classifyEquality(1, 3), 'someEqual');
  });

  QUnit.test('noneEqual when matched is 0', (assert) => {
    assert.equal(classifyEquality(0, 3), 'noneEqual');
  });
});

QUnit.module('classifyScheme', () => {
  QUnit.test('allEqual when all three colors match', (assert) => {
    assert.equal(classifyScheme(scheme(red, red, red), false), 'allEqual');
  });

  QUnit.test('someEqual when two colors match (non-adjacent)', (assert) => {
    // t1 === t3 but t2 differs — only detectable without requireAdjacency
    assert.equal(classifyScheme(scheme(red, green, red), false), 'someEqual');
  });

  QUnit.test('noneEqual when no adjacent pair matches with requireAdjacency', (assert) => {
    // t1 === t3 is ignored when requireAdjacency is true
    assert.equal(classifyScheme(scheme(red, green, red), true), 'noneEqual');
  });

  QUnit.test('noneEqual when all colors differ', (assert) => {
    assert.equal(classifyScheme(scheme(red, green, blue), false), 'noneEqual');
  });
});

QUnit.module('categorizeColorSchemes', () => {
  QUnit.test('sorts allEqual before someEqual before noneEqual', (assert) => {
    const none = scheme(red, green, blue);
    const some = scheme(red, red, blue);
    const all = scheme(red, red, red);

    const result = categorizeColorSchemes([none, some, all]);

    assert.deepEqual(result, [all, some, none]);
  });

  QUnit.test('preserves relative order within each category', (assert) => {
    const scheme1 = scheme(red, green, blue);
    const scheme2 = scheme(green, red, blue);

    const result = categorizeColorSchemes([scheme1, scheme2]);

    assert.deepEqual(result, [scheme1, scheme2]);
  });

  QUnit.test('non-adjacent match sorts before noneEqual without requireAdjacency', (assert) => {
    const nonAdjacent = scheme(red, green, red);
    const noMatch = scheme(red, green, blue);

    const result = categorizeColorSchemes([noMatch, nonAdjacent], false);

    assert.deepEqual(result, [nonAdjacent, noMatch], 'non-adjacent match is someEqual, sorts first');
  });

  QUnit.test('non-adjacent match is ignored with requireAdjacency', (assert) => {
    const nonAdjacent = scheme(red, green, red);
    const adjacent = scheme(red, red, blue);

    const result = categorizeColorSchemes([nonAdjacent, adjacent], true);

    assert.deepEqual(result, [adjacent, nonAdjacent], 'only adjacent match is someEqual, sorts first');
  });
});
