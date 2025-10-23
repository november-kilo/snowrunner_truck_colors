const ContextMenuController = {
  init() {
    this.contextMenu = DOM.getById('contextMenu');
    this.copyButton = DOM.getById('copyHSB');
    this.pasteButton = DOM.getById('pasteHSB');
    this.currentColorNumber = null;
    this.setupEventListeners();
  },

  isColorPreview(e) {
    const id = e.target.getAttribute('id');
    return id === 'color1Preview' || id === 'color2Preview' || id === 'color3Preview';
  },

  getColorNumber(e) {
    const id = e.target.getAttribute('id');
    if (id === 'color1Preview') {
      return 1;
    } else if (id === 'color2Preview') {
      return 2;
    } else if (id === 'color3Preview') {
      return 3;
    }
    return null;
  },

  setupEventListeners() {
    document.addEventListener('contextmenu', e => {
      if (this.isColorPreview(e)) {
        e.preventDefault();
      }
    });

    document.addEventListener('click', e => {
      if (!this.contextMenu.contains(e.target)) {
        this.hideMenu();
      }
    });

    let longPressTimer = null;
    const longPressThreshold = 500;
    document.addEventListener('touchstart', e => {
      longPressTimer = setTimeout(() => {
        if (this.isColorPreview(e)) {
          e.preventDefault();
          const colorNumber = this.getColorNumber(e);
          if (colorNumber) {
            this.showMenu(e, colorNumber);
          }
        }
      }, longPressThreshold);
    });

    document.addEventListener('mousedown', e => {
      if (this.isColorPreview(e) && e.button === 2) {
        this.showMenu(e, this.getColorNumber(e));
      }
    });

    if (this.copyButton !== null || this.pasteButton !== null) {
      [1, 2, 3].forEach(number => {
        const colorDisplay = document.getElementById(`colorDisplay${number}`);
        if (colorDisplay === null) {
          return;
        }
        colorDisplay.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.showMenu(e, number);
        });
      });
    }

    if (this.copyButton !== null) {
      this.copyButton.addEventListener('click', () => {
        if (this.currentColorNumber) {
          this.copyHSBValues(this.currentColorNumber)
            .then(() => Toast.success(Constants.hsbCopied))
            .catch((err) => Toast.error(err.message, 5000));
        }
        this.hideMenu();
      });
    }

    if (this.pasteButton !== null) {
      this.pasteButton.addEventListener('click', () => {
        if (this.currentColorNumber) {
          this.pasteHSBValues(this.currentColorNumber)
            .then(() => Toast.success(Constants.hsbPasted))
            .catch((err) => Toast.error(err.message, 5000));
        }
        this.hideMenu();
      });
    }
  },

  showMenu(e, colorNumber) {
    this.currentColorNumber = colorNumber;
    const x = e.clientX;
    const y = e.clientY;

    this.contextMenu.style.left = `${x}px`;
    this.contextMenu.style.top = `${y}px`;
    this.contextMenu.classList.remove('hidden');

    const rect = this.contextMenu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      this.contextMenu.style.left = `${x - rect.width}px`;
    }
    if (rect.bottom > window.innerHeight) {
      this.contextMenu.style.top = `${y - rect.height}px`;
    }
  },

  hideMenu() {
    this.contextMenu.classList.add('hidden');
  },

  getHsbValueOf(control, number) {
    return parseInt(document.getElementById(`${control}${number}`).innerText);
  },

  async copyHSBValues(hsb) {
    let hue, saturation, brightness;

    if (typeof hsb === 'number') {
      hue = this.getHsbValueOf('preview-hue', hsb);
      saturation = this.getHsbValueOf('preview-saturation', hsb);
      brightness = this.getHsbValueOf('preview-brightness', hsb);
    } else {
      ({ hue, saturation, brightness } = hsb);
    }

    const hsbString = JSON.stringify({ hue, saturation, brightness });

    try {
      await navigator.clipboard.writeText(hsbString);
    } catch (err) {
      throw new Error(`${Constants.hsbCopiedError}: ${err.message}`);
    }
  },

  async pasteHSBValues(number) {
    try {
      const text = await navigator.clipboard.readText();
      const hsb = JSON.parse(text);

      if (hsb.hue !== undefined &&
        hsb.saturation !== undefined &&
        hsb.brightness !== undefined) {

        ['hue', 'saturation', 'brightness'].forEach(control => {
          DOM.update.value(`${control}${number}`, hsb[control]);
          DOM.update.value(`${control}Input${number}`, hsb[control]);
        });

        EditorController.updateColor(number);
      }
    } catch (err) {
      throw new Error(`${Constants.hsbPastedError}: ${err}`);
    }
  }
};
