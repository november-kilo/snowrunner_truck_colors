import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ColorSwatch } from './ColorSwatch';
import type { HSB } from '../logic/types';

interface Props {
  label: string;
  colors: HSB[];
  onSwatchClick?: (hsb: HSB) => void;
}

export function HarmoniesBox({ label, colors, onSwatchClick }: Props) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>{label}</Typography>
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {colors.map((hsb, i) => (
          <ColorSwatch key={i} hsb={hsb} onClick={onSwatchClick ? () => onSwatchClick(hsb) : undefined} />
        ))}
      </Box>
    </Box>
  );
}
