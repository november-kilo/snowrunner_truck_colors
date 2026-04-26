import { fireEvent, render, screen } from '@testing-library/react';
import { ColorControlBox } from './ColorControlBox';
import type { HSB } from '../logic/types';

const color: HSB = { hue: 180, saturation: 50, brightness: 50 };

test('text input change fires onChange with updated value', () => {
  const onChange = vi.fn();
  render(<ColorControlBox label="Hue" controlKey="hue" min={0} max={360} color={color} onChange={onChange} />);

  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '200' } });

  expect(onChange).toHaveBeenCalledWith({ ...color, hue: 200 });
});

test('text input clamps value above max to max', () => {
  const onChange = vi.fn();
  render(<ColorControlBox label="Saturation" controlKey="saturation" min={0} max={100} color={color} onChange={onChange} />);

  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '150' } });

  expect(onChange).toHaveBeenCalledWith({ ...color, saturation: 100 });
});

test('text input clamps value below min to min', () => {
  const onChange = vi.fn();
  render(<ColorControlBox label="Brightness" controlKey="brightness" min={0} max={100} color={color} onChange={onChange} />);

  fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '-10' } });

  expect(onChange).toHaveBeenCalledWith({ ...color, brightness: 0 });
});
