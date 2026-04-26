import { useState } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { AlertColor } from '@mui/material';
import { ColorEditor } from './components/ColorEditor';
import { ColorExplorer } from './components/ColorExplorer';
import { ColorConverterTab } from './components/ColorConverterTab';
import type { ColorScheme, HSB } from './logic/types';

const theme = createTheme();

interface Toast { id: number; message: string; severity: AlertColor; }

const DEFAULT_COLORS: HSB[] = [
  { hue: 180, saturation: 50, brightness: 50 },
  { hue: 180, saturation: 50, brightness: 50 },
  { hue: 180, saturation: 50, brightness: 50 },
];

const COLOR_EXPLORER_TAB  = 0;
const COLOR_EDITOR_TAB    = 1;
const COLOR_CONVERTER_TAB = 2;

function App() {
  const [tab, setTab] = useState(COLOR_EXPLORER_TAB);
  const [editorColors, setEditorColors] = useState<HSB[]>(DEFAULT_COLORS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, severity: AlertColor = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, severity }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const handleLoadColors = (scheme: ColorScheme) => {
    const colorValues = Object.values(scheme.colors).slice(0, 3);
    setEditorColors(colorValues.map((c) => ({ ...c.hsb })));
    setTab(COLOR_EDITOR_TAB);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6">SnowRunner Color Tool</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tab} onChange={(_, v: number) => setTab(v)}>
            <Tab label="Color Explorer" />
            <Tab label="Color Editor" />
            <Tab label="Color Converter" />
          </Tabs>
        </Box>
        {tab === COLOR_EXPLORER_TAB  && <ColorExplorer onLoadColors={handleLoadColors} />}
        {tab === COLOR_EDITOR_TAB    && <ColorEditor colors={editorColors} onChange={setEditorColors} addToast={addToast} />}
        {tab === COLOR_CONVERTER_TAB && <ColorConverterTab addToast={addToast} />}
      </Container>
      <Box sx={{ position: 'fixed', top: 70, right: 16, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {toasts.map((t) => (
          <Alert key={t.id} severity={t.severity} variant="filled" sx={{ boxShadow: 3 }}>
            {t.message}
          </Alert>
        ))}
      </Box>
    </ThemeProvider>
  );
}

export default App;
