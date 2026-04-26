import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { AlertColor } from '@mui/material';
import { useClipboard } from '../context/ClipboardContext';
import { Constants } from '../logic/constants';
import { ColorConverter } from '../logic/color-converter';
import type { HSB } from '../logic/types';

interface Props {
  addToast: (message: string, severity?: AlertColor) => void;
}

export function ColorConverterTab({ addToast }: Props) {
  const { copy } = useClipboard();
  const [hex, setHex] = useState('');
  const [result, setResult] = useState<HSB | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      try {
        setResult(ColorConverter.hexToHsb(val));
        setError('');
      } catch (err) {
        setResult(null);
        setError(err instanceof Error ? err.message : String(err));
      }
    } else {
      setResult(null);
      setError(val.length > 1 ? 'Enter a valid 6-digit hex code' : '');
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    try {
      await copy(result);
      addToast(Constants.hsbCopied, 'success');
    } catch {
      addToast(Constants.hsbCopiedError, 'error');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 480, mx: 'auto' }}>
      <Typography variant="h6" textAlign="center" gutterBottom>CSS Hex to SnowRunner HSB</Typography>
      <Stack spacing={3}>
        <TextField
          label="CSS Hex Code"
          placeholder="#000000"
          value={hex}
          onChange={handleChange}
          error={Boolean(error)}
          helperText={error || ' '}
          fullWidth
        />
        <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, fontFamily: 'monospace', fontSize: 14 }}>
          {result
            ? `Hue: ${result.hue}, Saturation: ${result.saturation}, Brightness: ${result.brightness}`
            : 'Hue: N/A, Saturation: N/A, Brightness: N/A'}
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" onClick={handleCopy} disabled={!result}>
            Copy HSB
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
