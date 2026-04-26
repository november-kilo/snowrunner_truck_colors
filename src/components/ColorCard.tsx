import Box from '@mui/material/Box';
import type { ColorScheme } from '../logic/types';

interface Props {
  scheme: ColorScheme;
  onLoad: (scheme: ColorScheme) => void;
}

export function ColorCard({ scheme, onLoad }: Props) {
  const colorValues = Object.values(scheme.colors);
  return (
    <Box
      onClick={() => onLoad(scheme)}
      sx={{
        borderRadius: 1, overflow: 'hidden', cursor: 'pointer',
        height: 96, display: 'flex', flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'scale(1.05)', boxShadow: 4 },
      }}
    >
      {colorValues.map((color, i) => (
        <Box key={i} sx={{ flex: 1, backgroundColor: color.hex }} />
      ))}
    </Box>
  );
}
