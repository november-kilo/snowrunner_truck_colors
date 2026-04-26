import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ColorCard } from './ColorCard';
import { useTruckData } from '../hooks/useTruckData';
import { ColorUtil } from '../logic/color-util';
import type { ColorScheme } from '../logic/types';

interface Props {
  onLoadColors: (scheme: ColorScheme) => void;
}

export function ColorExplorer({ onLoadColors }: Props) {
  const { truckNames, truckColors, loading, error } = useTruckData();
  const [filter, setFilter] = useState('');
  const [selectedTruck, setSelectedTruck] = useState('');

  const filteredTrucks = useMemo(() =>
    truckNames.filter((n) => n.toLowerCase().includes(filter.toLowerCase())),
    [filter, truckNames]
  );

  const colorSchemes = useMemo(() => {
    if (!selectedTruck || loading) return [];
    if (selectedTruck === 'ALL') {
      const seen = new Map<string, ColorScheme>();
      truckColors.forEach((s) => {
        const key = Object.values(s.colors).map((c) => c.hex).sort().join('|');
        if (!seen.has(key)) seen.set(key, s);
      });
      return ColorUtil.categorizeSchemes(Array.from(seen.values()), true);
    }
    const schemes = truckColors.filter((s) => s.trucks.includes(selectedTruck) || s.trucks.includes('All'));
    return ColorUtil.categorizeSchemes(schemes, true);
  }, [selectedTruck, truckColors, loading]);

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, maxWidth: 600, mx: 'auto' }}>
        <Stack spacing={2}>
          <TextField
            label="Filter Trucks"
            placeholder="Truck name or part of name..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            fullWidth
          />
          <FormControl fullWidth size="small">
            <InputLabel>Select Truck</InputLabel>
            <Select
              value={selectedTruck}
              label="Select Truck"
              onChange={(e) => setSelectedTruck(e.target.value)}
            >
              <MenuItem value=""><em>Select a truck</em></MenuItem>
              <MenuItem value="ALL">All Colors</MenuItem>
              {filteredTrucks.map((name) => (
                <MenuItem key={name} value={name}>{name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" textAlign="center">{error}</Typography>
      )}

      {!loading && (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: 2 }}>
          {colorSchemes.map((scheme, idx) => (
            <ColorCard key={idx} scheme={scheme} onLoad={onLoadColors} />
          ))}
        </Box>
      )}
    </Box>
  );
}
