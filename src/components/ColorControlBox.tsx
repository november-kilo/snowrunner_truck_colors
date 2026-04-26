import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { HSB } from '../logic/types';

interface Props {
  label: string;
  controlKey: keyof HSB;
  min: number;
  max: number;
  color: HSB;
  onChange: (color: HSB) => void;
}

export function ColorControlBox({ label, controlKey, min, max, color, onChange }: Props) {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Slider
          min={min} max={max} value={color[controlKey]} size="small"
          onChange={(_, val) => onChange({ ...color, [controlKey]: val as number })}
          sx={{ flex: 1 }}
        />
        <TextField
          type="number"
          value={color[controlKey]}
          onChange={(e) => onChange({ ...color, [controlKey]: Math.min(max, Math.max(min, Number(e.target.value))) })}
          slotProps={{ htmlInput: { min, max } }}
          size="small"
          sx={{ width: 72 }}
        />
      </Box>
    </Box>
  );
}
