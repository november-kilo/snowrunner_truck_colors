QUnit.module('ColorConverter', () => {
  QUnit.module('normalizeHSB', () => {
    QUnit.test('passes through in-range values unchanged', (assert) => {
      assert.deepEqual(
        ColorConverter.normalizeHSB(180, 50, 75),
        { hue: 180, saturation: 50, brightness: 75 },
        'in-range values'
      );
    });

    QUnit.test('wraps hue above 360', (assert) => {
      assert.deepEqual(
        ColorConverter.normalizeHSB(400, 50, 50),
        { hue: 40, saturation: 50, brightness: 50 },
        '400 → 40'
      );
    });

    QUnit.test('wraps negative hue', (assert) => {
      assert.deepEqual(
        ColorConverter.normalizeHSB(-30, 50, 50),
        { hue: 330, saturation: 50, brightness: 50 },
        '-30 → 330'
      );
    });

    QUnit.test('clamps saturation above 100', (assert) => {
      assert.equal(ColorConverter.normalizeHSB(0, 150, 50).saturation, 100, 'saturation > 100 clamped to 100');
    });

    QUnit.test('clamps saturation below 0', (assert) => {
      assert.equal(ColorConverter.normalizeHSB(0, -10, 50).saturation, 0, 'saturation < 0 clamped to 0');
    });

    QUnit.test('clamps brightness above 100', (assert) => {
      assert.equal(ColorConverter.normalizeHSB(0, 50, 110).brightness, 100, 'brightness > 100 clamped to 100');
    });

    QUnit.test('clamps brightness below 0', (assert) => {
      assert.equal(ColorConverter.normalizeHSB(0, 50, -5).brightness, 0, 'brightness < 0 clamped to 0');
    });
  });

  QUnit.module('hsbToRgb', (hooks) => {
    let brightnessMidpoint;

    hooks.beforeEach(() => {
      // brightness=50 is the midpoint where saturation is fully expressed
      brightnessMidpoint = 50;
    })

    QUnit.test('sector 0: red (h=0)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(0, 100, brightnessMidpoint),
        [255, 0, 0],
        'red sector'
      );
    });

    QUnit.test('sector 1: yellow (h=60)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(60, 100, brightnessMidpoint),
        [255, 255, 0],
        'yellow sector'
      );
    });

    QUnit.test('sector 2: green (h=120)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(120, 100, brightnessMidpoint),
        [0, 255, 0],
        'green sector'
      );
    });

    QUnit.test('sector 3: cyan (h=180)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(180, 100, brightnessMidpoint),
        [0, 255, 255],
        'cyan sector'
      );
    });

    QUnit.test('sector 4: blue (h=240)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(240, 100, brightnessMidpoint),
        [0, 0, 255],
        'blue sector'
      );
    });

    QUnit.test('sector 5: magenta (h=300)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(300, 100, brightnessMidpoint),
        [255, 0, 255],
        'magenta sector'
      );
    });

    QUnit.test('white (s=0, b=100)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(0, 0, 100),
        [255, 255, 255],
        'white'
      );
    });

    QUnit.test('black (b=0)', (assert) => {
      assert.deepEqual(
        ColorConverter.hsbToRgb(0, 0, 0),
        [0, 0, 0],
        'black'
      );
    });
  });

  QUnit.module('rgbToString', () => {
    QUnit.test('formats as rgb()', (assert) => {
      assert.equal(ColorConverter.rgbToString(255, 128, 0), 'rgb(255, 128, 0)');
    });
  });

  QUnit.module('snowRunnerFormat', () => {
    QUnit.test('formats with semicolon separators', (assert) => {
      assert.equal(ColorConverter.snowRunnerFormat(255, 128, 0), 'SnowRunner: g(255; 128; 0)');
    });
  });

  QUnit.module('getHueFromRGB', () => {
    QUnit.test('returns 0 when delta is 0 (achromatic)', (assert) => {
      assert.equal(ColorConverter.getHueFromRGB(0, 0.5, 0.5, 0.5, 0.5), 0);
    });

    QUnit.test('computes hue when green is max', (assert) => {
      // r=0, g=1, b=0 → (b-r)/delta + 2 = 2 → 120°
      assert.equal(ColorConverter.getHueFromRGB(1, 1, 0, 1, 0), 120);
    });

    QUnit.test('wraps negative raw hue when blue > green with red max', (assert) => {
      // r=1, g=0, b=1 → ((0-1)/1)%6 = -1 → -60+360 = 300°
      assert.equal(ColorConverter.getHueFromRGB(1, 1, 1, 0, 1), 300);
    });
  });

  QUnit.module('hexToHsb', () => {
    QUnit.test('converts red', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#ff0000'),
        { hue: 0, saturation: 100, brightness: 50 }
      );
    });

    QUnit.test('converts green', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#00ff00'),
        { hue: 120, saturation: 100, brightness: 50 }
      );
    });

    QUnit.test('converts blue', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#0000ff'),
        { hue: 240, saturation: 100, brightness: 50 }
      );
    });

    QUnit.test('converts white', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#ffffff'),
        { hue: 0, saturation: 0, brightness: 100 }
      );
    });

    QUnit.test('converts black', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#000000'),
        { hue: 0, saturation: 0, brightness: 0 }
      );
    });

    QUnit.test('accepts hex without leading #', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('ff0000'),
        { hue: 0, saturation: 100, brightness: 50 }
      );
    });

    QUnit.test('accepts uppercase hex', (assert) => {
      assert.deepEqual(
        ColorConverter.hexToHsb('#FF0000'),
        { hue: 0, saturation: 100, brightness: 50 }
      );
    });

    QUnit.test('throws on invalid hex', (assert) => {
      assert.throws(
        () => ColorConverter.hexToHsb('#xyz'),
        /Invalid HEX Color/,
        'invalid hex handled'
      );
    });
  });
});
