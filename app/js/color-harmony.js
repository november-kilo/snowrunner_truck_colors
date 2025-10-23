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

  _createPreview(hsb) {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center color-preview';

    const colorSquare = document.createElement('div');
    colorSquare.className = 'w-16 h-16 rounded-lg mb-2 color-square';
    const [r, g, b] = ColorConverter.hsbToRgb(hsb.hue, hsb.saturation, hsb.brightness);
    colorSquare.style.backgroundColor = ColorConverter.rgbToString(r, g, b);
    colorSquare.title = ColorDescriptor.describe(hsb.hue, hsb.saturation, hsb.brightness);

    colorSquare.addEventListener('click', () => {
      this._handleColorClick(hsb);
    });

    const hsbValues = document.createElement('div');
    hsbValues.className = 'text-xs text-gray-600 text-center';
    hsbValues.innerHTML = `
      <div>H: ${Math.round(hsb.hue)}°</div>
      <div>S: ${Math.round(hsb.saturation)}%</div>
      <div>B: ${Math.round(hsb.brightness)}%</div>
    `;

    container.appendChild(colorSquare);
    container.appendChild(hsbValues);
    return container;
  },

  _handleColorClick(hsb) {
    ContextMenuController.copyHSBValues(hsb)
      .then(() => Toast.success(Constants.hsbCopied))
      .catch((err) => Toast.error(`${Constants.hsbCopiedError}: ${err.message}`));
  },

  updateHarmonies(number, hue, saturation, brightness) {
    const harmonies = {
      analogous: {
        title: 'Analogous',
        colors: this.analogous(hue, saturation, brightness)
      },
      triadic: {
        title: 'Triadic',
        colors: this.triadic(hue, saturation, brightness)
      },
      complementary: {
        title: 'Complementary',
        colors: this.complementary(hue, saturation, brightness)
      },
      splitComplementary: {
        title: 'Split Complementary',
        colors: this.splitComplementary(hue, saturation, brightness)
      },
      square: {
        title: 'Square',
        colors: this.square(hue, saturation, brightness)
      }
    };

    Object.entries(harmonies).forEach(([type, {colors}]) => {
      const container = document.querySelector(`#${type}Harmonies${number} .flex`);
      if (!container) return;

      container.innerHTML = '';

      colors.forEach(hsb => {
        container.appendChild(this._createPreview(hsb));
      });
    });
  }
};
