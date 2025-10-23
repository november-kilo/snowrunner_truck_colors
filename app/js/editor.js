const EditorController = {
  init() {
    this.setupControls();
    this.setupColorPreviews();
    this.setupResetButton();
  },

  loadColors(colors) {
    [1, 2, 3].forEach((number, index) => {
      const color = Object.values(colors.colors)[index];
      if (color) {
        DOM.update.value(`hue${number}`, color.hsb.hue);
        DOM.update.value(`hueInput${number}`, color.hsb.hue);
        DOM.update.value(`saturation${number}`, color.hsb.saturation);
        DOM.update.value(`saturationInput${number}`, color.hsb.saturation);
        DOM.update.value(`brightness${number}`, color.hsb.brightness);
        DOM.update.value(`brightnessInput${number}`, color.hsb.brightness);
        this.updateColor(number);
      }
    });
    this.showHarmonies(1);
  },

  setupControls() {
    ['hue', 'saturation', 'brightness'].forEach(control => {
      [1, 2, 3].forEach(number => {
        const slider = DOM.getById(`${control}${number}`);
        const input = DOM.getById(`${control}Input${number}`);

        slider.addEventListener('input', () => {
          input.value = slider.value;
          this.updateColor(number);
        });

        input.addEventListener('input', () => {
          slider.value = input.value;
          this.updateColor(number);
        });
      });
    });
  },

  setupColorPreviews() {
    [1, 2, 3].forEach(number => {
      const preview = DOM.getById(`colorDisplay${number}`);
      preview.addEventListener('click', () => this.showHarmonies(number));
    });
    this.updateAllColors();
  },

  setupResetButton() {
    DOM.getById('resetButton').addEventListener('click', () => {
      [1, 2, 3].forEach(number => {
        DOM.update.value(`hue${number}`, 180);
        DOM.update.value(`hueInput${number}`, 180);
        DOM.update.value(`saturation${number}`, 50);
        DOM.update.value(`saturationInput${number}`, 50);
        DOM.update.value(`brightness${number}`, 50);
        DOM.update.value(`brightnessInput${number}`, 50);
        this.updateColor(number);
      });
      this.showHarmonies(1);
    });
  },

  updateColor(number) {
    const hue = parseInt(DOM.getById(`hue${number}`).value);
    const saturation = parseInt(DOM.getById(`saturation${number}`).value);
    const brightness = parseInt(DOM.getById(`brightness${number}`).value);

    const [r, g, b] = ColorConverter.hsbToRgb(hue, saturation, brightness);
    const rgbString = ColorConverter.rgbToString(r, g, b);

    DOM.update.background(`colorDisplay${number}`, rgbString);
    DOM.update.text(`colorDesc${number}`, ColorDescriptor.describe(hue, saturation, brightness));
    DOM.update.text(`sr-c${number}-rgb`, ColorConverter.snowRunnerFormat(r, g, b));

    if (DOM.getById(`harmonies${number}`).classList.contains('hidden') === false) {
      ColorHarmony.updateHarmonies(number, hue, saturation, brightness);
    }

    this.updateStackedPreview();
  },

  updateStackedPreview() {
    [1, 2, 3].forEach(number => {
      const hue = parseInt(DOM.getById(`hue${number}`).value);
      const saturation = parseInt(DOM.getById(`saturation${number}`).value);
      const brightness = parseInt(DOM.getById(`brightness${number}`).value);

      const [r, g, b] = ColorConverter.hsbToRgb(hue, saturation, brightness);
      const colorElement = DOM.getById(`stackedColor${number}`);
      colorElement.style.backgroundColor = ColorConverter.rgbToString(r, g, b);
    });
  },

  updateAllColors() {
    [1, 2, 3].forEach(number => this.updateColor(number));
    this.showHarmonies(1);
  },

  showHarmonies(number) {
    [1, 2, 3].forEach(n => {
      DOM.getById(`harmonies${n}`).classList.add('hidden');
      DOM.getById(`colorDisplay${n}`).classList.remove('ring-2', 'ring-blue-500');
    });

    DOM.getById(`harmonies${number}`).classList.remove('hidden');
    DOM.getById(`colorDisplay${number}`).classList.add('ring-2', 'ring-blue-500');
    DOM.getById('editor-selectedColorType').textContent =
      `(${number === 1 ? 'Primary' : number === 2 ? 'Secondary' : 'Tertiary'} Color)`;

    const hue = parseInt(DOM.getById(`hue${number}`).value);
    const saturation = parseInt(DOM.getById(`saturation${number}`).value);
    const brightness = parseInt(DOM.getById(`brightness${number}`).value);
    ColorHarmony.updateHarmonies(number, hue, saturation, brightness);
  }
};
