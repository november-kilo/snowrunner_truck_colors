const fs = require('fs');
const xml2js = require('xml2js');
const { ColorConverter } = require('./util.js');

function postProcessTruckColors(truckColors, truckNames) {
  return truckColors.map((entry) => {
    entry.trucks.sort((a, b) => a.localeCompare(b));

    const hasSameTrucks = truckNames.length === entry.trucks.length &&
      truckNames.every((name, index) => entry.trucks[index] === name);

    if (hasSameTrucks) {
      entry.trucks = ['All'];
    }
    return entry;
  }).sort((a, b) => {
    if (a.trucks[0] === 'All') return -1;
    if (b.trucks[0] === 'All') return 1;
    return a.trucks[0].localeCompare(b.trucks[0]);
  });
}

fs.readFile('./presets/original.xml', 'utf-8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(data, (err, result) => {
    if (err) {
      console.error('Error parsing XML:', err);
      return;
    }

    const truckNames = result.TruckSet.Truck
      .map(truck => truck.$.Name)
      .sort((a, b) => a.localeCompare(b));

    const colorMap = new Map();
    result.TruckSet.Truck.forEach(truck => {
      if (!truck.CustomizationPreset) return;

      const presets = Array.isArray(truck.CustomizationPreset)
        ? truck.CustomizationPreset
        : [truck.CustomizationPreset];

      presets.forEach(preset => {
        const colorKey = `${preset.$.TintColor1}-${preset.$.TintColor2}-${preset.$.TintColor3}`;
        if (!colorMap.has(colorKey)) {
          colorMap.set(colorKey, {
            trucks: [truck.$.Name],
            colors: {
              tint1: processColor(preset.$.TintColor1),
              tint2: processColor(preset.$.TintColor2),
              tint3: processColor(preset.$.TintColor3)
            }
          });
        } else {
          const entry = colorMap.get(colorKey);
          if (!entry.trucks.includes(truck.$.Name)) {
            entry.trucks.push(truck.$.Name);
          }
        }
      });
    });

    let truckColors = Array.from(colorMap.values());
    truckColors = postProcessTruckColors(truckColors, truckNames);

    fs.writeFileSync('../src/data/truck-names.json', JSON.stringify(truckNames, null, 2));
    fs.writeFileSync('../public/data/truck-colors.json', JSON.stringify(truckColors));
  });
});

function processColor(snowRunnerColor) {
  const rgb = ColorConverter.snowRunnerToRgb(snowRunnerColor);
  const hsb = ColorConverter.rgbStringToHsb(snowRunnerColor);
  return { hex: rgbToHex(...rgb), hsb };
}

const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
}).join('');
