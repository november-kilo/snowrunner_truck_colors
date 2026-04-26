import { useMemo } from 'react';
import Stack from '@mui/material/Stack';
import { HarmoniesBox } from './HarmoniesBox';
import { ColorHarmony } from '../logic/color-harmony';
import type { HSB } from '../logic/types';

interface Props {
  hue: number;
  saturation: number;
  brightness: number;
  onSwatchClick?: (hsb: HSB) => void;
}

export function HarmoniesPanel({ hue, saturation, brightness, onSwatchClick }: Props) {
  const harmonies = useMemo(() => [
    { label: 'Analogous',           colors: ColorHarmony.analogous(hue, saturation, brightness) },
    { label: 'Triadic',             colors: ColorHarmony.triadic(hue, saturation, brightness) },
    { label: 'Complementary',       colors: ColorHarmony.complementary(hue, saturation, brightness) },
    { label: 'Split Complementary', colors: ColorHarmony.splitComplementary(hue, saturation, brightness) },
    { label: 'Square',              colors: ColorHarmony.square(hue, saturation, brightness) },
  ], [hue, saturation, brightness]);

  return (
    <Stack spacing={3}>
      {harmonies.map(({ label, colors }) => (
        <HarmoniesBox key={label} label={label} colors={colors} onSwatchClick={onSwatchClick} />
      ))}
    </Stack>
  );
}
