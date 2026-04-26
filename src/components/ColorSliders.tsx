import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ColorControlBox } from './ColorControlBox';
import { ColorConverter } from '../logic/color-converter';
import type { HSB } from '../logic/types';

interface Props {
  label: string;
  color: HSB;
  onChange: (color: HSB) => void;
  isActive: boolean;
  onActivate: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const CONTROLS: { label: string; key: keyof HSB; min: number; max: number }[] = [
  { label: 'Hue',        key: 'hue',        min: 0, max: 360 },
  { label: 'Saturation', key: 'saturation', min: 0, max: 100 },
  { label: 'Brightness', key: 'brightness', min: 0, max: 100 },
];

export function ColorSliders({ label, color, onChange, isActive, onActivate, onContextMenu }: Props) {
  const css = ColorConverter.hsbToCss(color.hue, color.saturation, color.brightness);
  const [r, g, b] = ColorConverter.hsbToRgb(color.hue, color.saturation, color.brightness);

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{label}</Typography>
      <Box
        sx={{
          height: 96, borderRadius: 1, backgroundColor: css, cursor: 'pointer',
          boxShadow: isActive ? '0 0 0 3px #1976d2' : 'none',
          transition: 'box-shadow 0.15s',
        }}
        onClick={onActivate}
        onContextMenu={onContextMenu}
      />
      <Typography variant="caption" color="text.secondary">
        {ColorConverter.snowRunnerFormat(r, g, b)}
      </Typography>
      {CONTROLS.map(({ label: controlLabel, key, min, max }) => (
        <ColorControlBox
          key={key}
          label={controlLabel}
          controlKey={key}
          min={min}
          max={max}
          color={color}
          onChange={onChange}
        />
      ))}
    </Stack>
  );
}
