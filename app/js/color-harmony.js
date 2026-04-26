const ColorHarmony = {
  analogous(hue, saturation, brightness) {
    return [
      { hue: (hue - 30 + 360) % 360, saturation, brightness },
      { hue, saturation, brightness },
      { hue: (hue + 30) % 360, saturation, brightness }
    ];
  },

  triadic(hue, saturation, brightness) {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 120) % 360, saturation, brightness },
      { hue: (hue + 240) % 360, saturation, brightness }
    ];
  },

  complementary(hue, saturation, brightness) {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 180) % 360, saturation, brightness }
    ];
  },

  splitComplementary(hue, saturation, brightness) {
    const complement = (hue + 180) % 360;
    return [
      { hue, saturation, brightness },
      { hue: (complement - 30 + 360) % 360, saturation, brightness },
      { hue: (complement + 30) % 360, saturation, brightness }
    ];
  },

  square(hue, saturation, brightness) {
    return [
      { hue, saturation, brightness },
      { hue: (hue + 90) % 360, saturation, brightness },
      { hue: (hue + 180) % 360, saturation, brightness },
      { hue: (hue + 270) % 360, saturation, brightness }
    ];
  },
};
