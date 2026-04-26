import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import type { AlertColor } from '@mui/material';
import { ColorSlidersGrid } from './ColorSlidersGrid';
import { HarmoniesPanel } from './HarmoniesPanel';
import { useClipboard } from '../context/ClipboardContext';
import { Constants } from '../logic/constants';
import { ColorConverter } from '../logic/color-converter';
import type { HSB } from '../logic/types';

interface ContextMenu { x: number; y: number; colorIdx: number; }

const DEFAULT_COLORS: HSB[] = [
  { hue: 180, saturation: 50, brightness: 50 },
  { hue: 180, saturation: 50, brightness: 50 },
  { hue: 180, saturation: 50, brightness: 50 },
];

const LABELS = ['Primary Color', 'Secondary Color', 'Tertiary Color'];

interface Props {
  colors: HSB[];
  onChange: (colors: HSB[]) => void;
  addToast: (message: string, severity?: AlertColor) => void;
}

export function ColorEditor({ colors, onChange, addToast }: Props) {
  const { copy, paste } = useClipboard();
  const [activeColor, setActiveColor] = useState(0);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const handleCopy = async () => {
    const c = colors[contextMenu!.colorIdx];
    setContextMenu(null);
    await copy(c);
    addToast(Constants.hsbCopied, 'success');
  };

  const handlePaste = async () => {
    const idx = contextMenu!.colorIdx;
    setContextMenu(null);
    try {
      const hsb = await paste();
      const updated = [...colors];
      updated[idx] = { hue: hsb.hue, saturation: hsb.saturation, brightness: hsb.brightness };
      onChange(updated);
      addToast(Constants.hsbPasted, 'success');
    } catch (err) {
      addToast(`${Constants.hsbPastedError}: ${err instanceof Error ? err.message : String(err)}`, 'error');
    }
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <ColorSlidersGrid
          colors={colors}
          labels={LABELS}
          onChange={onChange}
          activeColor={activeColor}
          setActiveColor={setActiveColor}
          setContextMenu={setContextMenu}
        />

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Box sx={{ width: 100, height: 100, borderRadius: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {colors.map((c, i) => (
              <Box key={i} sx={{ flex: 1, backgroundColor: ColorConverter.hsbToCss(c.hue, c.saturation, c.brightness) }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => { setActiveColor(0); onChange(DEFAULT_COLORS); }}
          >
            Reset Colors
          </Button>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
          <Typography variant="h6">Color Harmonies</Typography>
          <Typography variant="body2" color="text.secondary">({LABELS[activeColor]})</Typography>
        </Box>
        <HarmoniesPanel
          hue={colors[activeColor]!.hue}
          saturation={colors[activeColor]!.saturation}
          brightness={colors[activeColor]!.brightness}
          onSwatchClick={async (hsb) => {
            await copy(hsb);
            addToast(Constants.hsbCopied, 'success');
          }}
        />
      </Paper>

      <Menu
        open={Boolean(contextMenu)}
        onClose={() => setContextMenu(null)}
        anchorReference="anchorPosition"
        anchorPosition={contextMenu ? { top: contextMenu.y, left: contextMenu.x } : undefined}
      >
        <MenuItem onClick={handleCopy}>Copy HSB Values</MenuItem>
        <MenuItem onClick={handlePaste}>Paste HSB Values</MenuItem>
      </Menu>
    </Box>
  );
}
