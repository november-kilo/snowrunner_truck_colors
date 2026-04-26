import type { HSB } from './types';

export const ColorHarmony = {
  analogous(hue: number, saturation: number, brightness: number): HSB[] {
    return [
      { hue: (hue - 30 + 360) % 360, saturation, brightness },
      { hue, saturation, brightness },
      { hue: (hue + 30) % 360, saturation, brightness },
    ];
  },

  triadic(hue: number, saturation: number, brightness: number): HSB[] {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 120) % 360, saturation, brightness },
      { hue: (hue + 240) % 360, saturation, brightness },
    ];
  },

  complementary(hue: number, saturation: number, brightness: number): HSB[] {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 180) % 360, saturation, brightness },
    ];
  },

  splitComplementary(hue: number, saturation: number, brightness: number): HSB[] {
    const complement = (hue + 180) % 360;
    return [
      { hue, saturation, brightness },
      { hue: (complement - 30 + 360) % 360, saturation, brightness },
      { hue: (complement + 30) % 360, saturation, brightness },
    ];
  },

  square(hue: number, saturation: number, brightness: number): HSB[] {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 90) % 360, saturation, brightness },
      { hue: (hue + 180) % 360, saturation, brightness },
      { hue: (hue + 270) % 360, saturation, brightness },
    ];
  },
};
