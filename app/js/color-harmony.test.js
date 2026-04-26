QUnit.module('ColorHarmony', () => {
  QUnit.test('analogous returns hues 30° on either side', (assert) => {
    const result = ColorHarmony.analogous(60, 80, 90);

    assert.deepEqual(result, [
      { hue: 30, saturation: 80, brightness: 90 },
      { hue: 60, saturation: 80, brightness: 90 },
      { hue: 90, saturation: 80, brightness: 90 },
    ], 'analogous should return 3 hues');
  });

  QUnit.test('analogous wraps around 0°', (assert) => {
    const result = ColorHarmony.analogous(10, 100, 100);

    assert.deepEqual(result[0], { hue: 340, saturation: 100, brightness: 100 }, 'analogous wraps');
  });

  QUnit.test('triadic returns hues 120° apart', (assert) => {
    const result = ColorHarmony.triadic(0, 100, 100);

    assert.deepEqual(result, [
      { hue: 0,   saturation: 100, brightness: 100 },
      { hue: 120, saturation: 100, brightness: 100 },
      { hue: 240, saturation: 100, brightness: 100 },
    ], 'triadic should return 3 hues');
  });

  QUnit.test('complementary returns hue and its opposite 180° away', (assert) => {
    const result = ColorHarmony.complementary(90, 70, 80);

    assert.deepEqual(result, [
      { hue: 90,  saturation: 70, brightness: 80 },
      { hue: 270, saturation: 70, brightness: 80 },
    ], 'complementary should return 2 hues');
  });

  QUnit.test('splitComplementary returns hues 150° and 210° away', (assert) => {
    const result = ColorHarmony.splitComplementary(0, 100, 100);

    assert.deepEqual(result, [
      { hue: 0,   saturation: 100, brightness: 100 },
      { hue: 150, saturation: 100, brightness: 100 },
      { hue: 210, saturation: 100, brightness: 100 },
    ], 'splitComplementary should return 3 hues');
  });

  QUnit.test('splitComplementary wraps around 0° when complement is near 0°', (assert) => {
    const result = ColorHarmony.splitComplementary(180, 100, 100);

    assert.deepEqual(result[1], { hue: 330, saturation: 100, brightness: 100 }, 'splitComplementary wraps');
  });

  QUnit.test('square returns four hues 90° apart', (assert) => {
    const result = ColorHarmony.square(0, 50, 60);

    assert.deepEqual(result, [
      { hue: 0,   saturation: 50, brightness: 60 },
      { hue: 90,  saturation: 50, brightness: 60 },
      { hue: 180, saturation: 50, brightness: 60 },
      { hue: 270, saturation: 50, brightness: 60 },
    ], 'square should return 4 hues');
  });
});
