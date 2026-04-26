import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClipboardProvider } from '../context/ClipboardContext';
import type { HSB } from '../logic/types';
import { ColorEditor } from './ColorEditor';

const someColors: HSB[] = [
  { hue: 0,   saturation: 0,   brightness: 0   },
  { hue: 0,   saturation: 0,   brightness: 0   },
  { hue: 0,   saturation: 0,   brightness: 0   },
];

function renderEditor(onChange = vi.fn()) {
  return render(
    <ClipboardProvider>
      <ColorEditor colors={someColors} onChange={onChange} addToast={vi.fn()} />
    </ClipboardProvider>
  );
}

test('Reset Colors button calls onChange with default HSB values', async () => {
  const onChange = vi.fn();
  renderEditor(onChange);

  await userEvent.click(screen.getByRole('button', { name: 'Reset Colors' }));

  expect(onChange).toHaveBeenCalledWith([
    { hue: 180, saturation: 50, brightness: 50 },
    { hue: 180, saturation: 50, brightness: 50 },
    { hue: 180, saturation: 50, brightness: 50 },
  ]);
});
