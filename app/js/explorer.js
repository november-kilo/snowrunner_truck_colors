const ExplorerController = {
  init() {
    this.truckFilter = document.getElementById('truckFilter');
    this.truckSelect = document.getElementById('truckSelect');
    this.colorGrid = document.getElementById('colorGrid');
    this.modal = document.getElementById('colorModal');
    this.closeModal = document.getElementById('closeModal');

    this.currentColorData = null;
    this.selectedColorIndex = 0;

    this.bindEvents();
    this.populateTruckSelect();
  },

  bindEvents() {
    this.truckFilter.addEventListener('input', () => this.populateTruckSelect(this.truckFilter.value));
    this.truckSelect.addEventListener('change', () => this.handleTruckSelection());
    this.closeModal.addEventListener('click', () => this.hideModal());
  },

  populateTruckSelect(filter = '') {
    const filteredTrucks = truckNames.filter(name =>
      name.toLowerCase().includes(filter.toLowerCase())
    );

    this.truckSelect.innerHTML = '<option value="">Select a truck</option>';

    const allOption = document.createElement('option');
    allOption.value = "ALL";
    allOption.textContent = "All Colors";
    this.truckSelect.appendChild(allOption);

    filteredTrucks.forEach(truck => {
      const option = document.createElement('option');
      option.value = truck;
      option.textContent = truck;
      this.truckSelect.appendChild(option);
    });
  },

  createColorCard(colors) {
    const card = document.createElement('div');
    card.className = 'color-square rounded-lg cursor-pointer';

    const preview = document.createElement('div');
    preview.className = 'h-24 flex flex-col color-preview';

    const colorValues = Object.values(colors.colors);
    colorValues.forEach((color, index) => {
      const strip = document.createElement('div');
      strip.className = 'flex-1';
      if (index === 0) {
        strip.className += ' rounded-t-lg';
      }
      if (index === colorValues.length - 1) {
        strip.className += ' rounded-b-lg';
      }
      strip.style.backgroundColor = color.hex;
      preview.appendChild(strip);
    });


    card.appendChild(preview);
    card.addEventListener('click', () => {
      TabController.storeExplorerPosition();
      EditorController.loadColors(colors);
      TabController.switchToTab('editor');
    });

    return card;
  },

  createHarmonyColorCard(color) {
    const card = document.createElement('div');
    card.className = 'flex flex-col w-50';

    const colorPreview = document.createElement('div');
    colorPreview.className = 'h-24 rounded-lg mb-2';
    colorPreview.style.backgroundColor = color.hex;

    const colorInfo = document.createElement('div');
    colorInfo.className = 'text-sm space-y-1';
    colorInfo.innerHTML = `
            <div class="text-gray-700">Description: ${color.description}</div>
            <div class="text-gray-600">RGB: ${color.rgb}</div>
            <div class="text-gray-600">Hex: ${color.hex}</div>
            <div class="text-gray-600">SnowRunner: ${color.snowrunner}</div>
            <div class="text-gray-600">HSB: ${color.hsb.hue}&deg; ${color.hsb.saturation}% ${color.hsb.brightness}%</div>
        `;

    card.appendChild(colorPreview);
    card.appendChild(colorInfo);
    return card;
  },

  updateHarmonies(colorIndex) {
    this.selectedColorIndex = colorIndex;
    const colorTypes = ['Primary', 'Secondary', 'Tertiary'];
    document.getElementById('selectedColorType').textContent = `(${colorTypes[colorIndex]} Color)`;

    document.querySelectorAll('[id^="color"][id$="Preview"]').forEach(el => {
      el.classList.remove('ring-2', 'ring-blue-500');
    });

    document.getElementById(`color${colorIndex + 1}Preview`).classList.add('ring-2', 'ring-blue-500');

    const selectedColor = Object.values(this.currentColorData.colors)[colorIndex];

    Object.entries(selectedColor.harmonies).forEach(([type, colors]) => {
      const container = document.querySelector(`#${type}Harmonies .flex`);
      container.innerHTML = '';

      colors.forEach(harmony => {
        container.appendChild(this.createHarmonyColorCard(harmony));
      });
    });
  },

  showColorDetails(colors) {
    this.currentColorData = colors;

    ['1', '2', '3'].forEach((num, index) => {
      const color = Object.values(colors.colors)[index];
      const preview = document.getElementById(`color${num}Preview`);
      const info = document.getElementById(`color${num}Info`);

      const hue = `preview-hue${num}`;
      const saturation = `preview-saturation${num}`;
      const brightness = `preview-brightness${num}`;

      preview.style.backgroundColor = color.hex;
      info.innerHTML = `
                <span style="display:none" id=${hue}>${color.hsb.hue}</span>
                <span style="display:none" id=${saturation}>${color.hsb.saturation}</span>
                <span style="display:none" id=${brightness}>${color.hsb.brightness}</span>
                <div>Description: ${color.description}</div>
                <div>RGB: ${color.rgb}</div>
                <div>Hex: ${color.hex}</div>
                <div>SnowRunner: ${color.snowrunner}</div>
                <div>HSB: ${color.hsb.hue}&deg; ${color.hsb.saturation}% ${color.hsb.brightness}%</div>
            `;

      preview.onclick = () => this.updateHarmonies(parseInt(preview.dataset.colorIndex));
    });

    this.updateHarmonies(0);
    this.showModal();
  },

  handleTruckSelection() {
    const selectedTruck = this.truckSelect.value;
    this.colorGrid.innerHTML = '';

    if (selectedTruck) {
      if (selectedTruck === 'ALL') {
        this.showAllColors();
      } else {
        this.showTruckColors(selectedTruck);
      }
    }
  },

  showAllColors() {
    const uniqueColors = new Map();

    truckColors.forEach(scheme => {
      const colorKey = Object.values(scheme.colors)
        .map(color => color.hex)
        .sort()
        .join('|');

      if (!uniqueColors.has(colorKey)) {
        uniqueColors.set(colorKey, scheme);
      }
    });

    const categorizedSchemes = categorizeColorSchemes(Array.from(uniqueColors.values()), true);
    categorizedSchemes.forEach(scheme => {
      this.colorGrid.appendChild(this.createColorCard(scheme));
    });
  },

  showTruckColors(selectedTruck) {
    const truckColorSchemes = truckColors.filter(scheme =>
      scheme.trucks.includes(selectedTruck) || scheme.trucks.includes('All')
    );

    const categorizedSchemes = categorizeColorSchemes(truckColorSchemes, true);
    categorizedSchemes.forEach(scheme => {
      this.colorGrid.appendChild(this.createColorCard(scheme));
    });
  },

  showModal() {
    this.modal.classList.remove('hidden');
  },

  hideModal() {
    this.modal.classList.add('hidden');
  }
};
