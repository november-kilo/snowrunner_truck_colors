QUnit.module('ColorDescriptor', () => {
  QUnit.test('dark modifier applied when saturation is mid-range', (assert) => {
    const result = ColorDescriptor.describe(240, 50, 20);

    assert.true(result.includes('dark'), 'dark blue');
  });

  QUnit.test('bright modifier applied when saturation is mid-range', (assert) => {
    const result = ColorDescriptor.describe(240, 50, 70);

    assert.true(result.includes('bright'), 'bright blue');
  });

  QUnit.test('pale modifier applied when brightness is mid-range', (assert) => {
    const result = ColorDescriptor.describe(240, 15, 50);

    assert.true(result.includes('pale'), 'pale blue');
  });

  QUnit.test('vivid modifier applied when brightness is mid-range', (assert) => {
    const result = ColorDescriptor.describe(240, 80, 50);

    assert.true(result.includes('vivid'), 'vivid blue');
  });

  QUnit.test('no modifier when saturation and brightness are both mid-range', (assert) => {
    const result = ColorDescriptor.describe(240, 50, 50);

    assert.equal(result, 'blue', 'plain blue');
  });

  QUnit.test('low saturation suppresses bright modifier', (assert) => {
    const result = ColorDescriptor.describe(240, 20, 70);

    assert.false(result.includes('bright'), 'no "bright" when saturation is pale');
    assert.true(result.includes('pale'), 'pale wins');
  });

  QUnit.test('high saturation suppresses dark modifier', (assert) => {
    const result = ColorDescriptor.describe(240, 80, 20);

    assert.false(result.includes('dark'), 'no "dark" when saturation is vivid');
    assert.true(result.includes('vivid'), 'vivid wins');
  });
});
