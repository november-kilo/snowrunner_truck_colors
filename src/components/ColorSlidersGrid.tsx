import Grid from '@mui/material/Grid2';
import { ColorSliders } from './ColorSliders';
import type { HSB } from '../logic/types';

interface ContextMenu { x: number; y: number; colorIdx: number; }

interface Props {
  colors: HSB[];
  labels: string[];
  onChange: (colors: HSB[]) => void;
  activeColor: number;
  setActiveColor: (idx: number) => void;
  setContextMenu: (menu: ContextMenu | null) => void;
}

export function ColorSlidersGrid({ colors, labels, onChange, activeColor, setActiveColor, setContextMenu }: Props) {
  return (
    <Grid container spacing={3}>
      {colors.map((color, idx) => (
        <Grid size={{ xs: 12, md: 4 }} key={idx}>
          <ColorSliders
            label={labels[idx] ?? `Color ${idx + 1}`}
            color={color}
            onChange={(updated) => {
              const next = [...colors];
              next[idx] = updated;
              onChange(next);
            }}
            isActive={activeColor === idx}
            onActivate={() => setActiveColor(idx)}
            onContextMenu={(e) => {
              e.preventDefault();
              setContextMenu({ x: e.clientX, y: e.clientY, colorIdx: idx });
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
