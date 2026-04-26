import { ColorHarmony } from './color-harmony';

describe('ColorHarmony', () => {
  test('analogous returns hues 30° on either side', () => {
    expect(ColorHarmony.analogous(60, 80, 90)).toEqual([
      { hue: 30, saturation: 80, brightness: 90 },
      { hue: 60, saturation: 80, brightness: 90 },
      { hue: 90, saturation: 80, brightness: 90 },
    ]);
  });

  test('analogous wraps around 0°', () => {
    expect(ColorHarmony.analogous(10, 100, 100)[0]).toEqual({ hue: 340, saturation: 100, brightness: 100 });
  });

  test('triadic returns hues 120° apart', () => {
    expect(ColorHarmony.triadic(0, 100, 100)).toEqual([
      { hue: 0,   saturation: 100, brightness: 100 },
      { hue: 120, saturation: 100, brightness: 100 },
      { hue: 240, saturation: 100, brightness: 100 },
    ]);
  });

  test('complementary returns hue and its opposite 180° away', () => {
    expect(ColorHarmony.complementary(90, 70, 80)).toEqual([
      { hue: 90,  saturation: 70, brightness: 80 },
      { hue: 270, saturation: 70, brightness: 80 },
    ]);
  });

  test('splitComplementary returns hues 150° and 210° away', () => {
    expect(ColorHarmony.splitComplementary(0, 100, 100)).toEqual([
      { hue: 0,   saturation: 100, brightness: 100 },
      { hue: 150, saturation: 100, brightness: 100 },
      { hue: 210, saturation: 100, brightness: 100 },
    ]);
  });

  test('splitComplementary wraps around 0° when complement is near 0°', () => {
    expect(ColorHarmony.splitComplementary(180, 100, 100)[1]).toEqual({ hue: 330, saturation: 100, brightness: 100 });
  });

  test('square returns four hues 90° apart', () => {
    expect(ColorHarmony.square(0, 50, 60)).toEqual([
      { hue: 0,   saturation: 50, brightness: 60 },
      { hue: 90,  saturation: 50, brightness: 60 },
      { hue: 180, saturation: 50, brightness: 60 },
      { hue: 270, saturation: 50, brightness: 60 },
    ]);
  });
});
