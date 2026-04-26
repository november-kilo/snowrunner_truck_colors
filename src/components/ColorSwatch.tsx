import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ColorConverter } from '../logic/color-converter';
import type { HSB } from '../logic/types';

function HSBSwatchValues({ hsb }: { hsb: HSB }) {
  return (
    <>
      <div>H: {hsb.hue}°</div>
      <div>S: {hsb.saturation}%</div>
      <div>B: {hsb.brightness}%</div>
    </>
  );
}

interface Props {
  hsb: HSB;
  onClick?: () => void;
}

export function ColorSwatch({ hsb, onClick }: Props) {
  const css = ColorConverter.hsbToCss(hsb.hue, hsb.saturation, hsb.brightness);
  return (
    <Box
      onClick={onClick}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: onClick ? 'pointer' : 'default' }}
    >
      <Box
        sx={{
          width: 64, height: 64, borderRadius: 1, mb: 0.5,
          backgroundColor: css,
          transition: 'transform 0.2s, box-shadow 0.2s',
          ...(onClick && { '&:hover': { transform: 'scale(1.08)', boxShadow: 3 } }),
        }}
      />
      <Typography variant="caption" color="text.secondary" component="div" textAlign="center">
        <HSBSwatchValues hsb={hsb} />
      </Typography>
    </Box>
  );
}
