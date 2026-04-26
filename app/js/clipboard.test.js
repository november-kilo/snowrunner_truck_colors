QUnit.module('HsbClipboard', (hooks) => {
  function stubClipboard(overrides) {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: async () => {},
        readText: async () => { throw new Error('denied'); },
        ...overrides,
      },
      writable: true,
      configurable: true,
    });
  }

  hooks.beforeEach(() => {
    HsbClipboard._stored = null;
    stubClipboard({});
  });

  hooks.afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
      configurable: true,
    });
  });

  QUnit.test('paste throws when nothing stored and system clipboard fails', async (assert) => {
    await assert.rejects(
      HsbClipboard.paste(),
      /Nothing to paste/,
      'threw because nothing stored and system clipboard failed'
    );
  });

  QUnit.test('copy stores hsb to _stored', async (assert) => {
    const hsb = { hue: 120, saturation: 50, brightness: 75 };

    await HsbClipboard.copy(hsb);

    assert.deepEqual(HsbClipboard._stored, hsb, 'stored hsb');
  });

  QUnit.test('paste returns stored value when system clipboard fails', async (assert) => {
    const hsb = { hue: 120, saturation: 50, brightness: 75 };
    await HsbClipboard.copy(hsb);

    const result = await HsbClipboard.paste();

    assert.deepEqual(result, hsb, 'returned stored hsb');
  });

  QUnit.test('paste returns system clipboard value when it contains valid hsb', async (assert) => {
    const hsb = { hue: 240, saturation: 100, brightness: 80 };
    stubClipboard({ readText: async () => JSON.stringify(hsb) });

    const result = await HsbClipboard.paste();

    assert.deepEqual(result, hsb, 'returned system clipboard hsb');
  });

  QUnit.test('paste falls back to stored when system clipboard has non-hsb json', async (assert) => {
    const stored = { hue: 10, saturation: 20, brightness: 30 };
    HsbClipboard._stored = stored;
    stubClipboard({ readText: async () => JSON.stringify({ foo: 'bar' }) });

    const result = await HsbClipboard.paste();

    assert.deepEqual(result, stored, 'returned stored hsb (fallback)');
  });

  QUnit.test('paste falls back to stored when system clipboard has non-json text', async (assert) => {
    const stored = { hue: 10, saturation: 20, brightness: 30 };
    HsbClipboard._stored = stored;
    stubClipboard({ readText: async () => 'not json' });

    const result = await HsbClipboard.paste();

    assert.deepEqual(result, stored, 'returned stored hsb (fallback)');
  });
});
