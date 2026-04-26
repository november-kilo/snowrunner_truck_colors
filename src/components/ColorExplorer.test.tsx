import { render, screen, waitFor } from '@testing-library/react';
import type { ColorScheme } from '../logic/types';
import { ColorExplorer } from './ColorExplorer';

const mockSchemes: ColorScheme[] = [
  {
    trucks: ['truck_a'],
    colors: {
      tint1: { hex: '#ff0000', hsb: { hue: 0,   saturation: 100, brightness: 50 } },
      tint2: { hex: '#00ff00', hsb: { hue: 120, saturation: 100, brightness: 50 } },
      tint3: { hex: '#0000ff', hsb: { hue: 240, saturation: 100, brightness: 50 } },
    },
  },
];

function stubFetch(data: ColorScheme[]) {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  }));
}

afterEach(() => { vi.unstubAllGlobals(); });

test('shows loading spinner while truck colors are fetching', () => {
  // Never-resolving fetch keeps loading:true so no state update fires after assertion
  vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})));
  render(<ColorExplorer onLoadColors={vi.fn()} />);

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

test('hides spinner after truck colors load', async () => {
  stubFetch(mockSchemes);
  render(<ColorExplorer onLoadColors={vi.fn()} />);

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});

test('shows error message when fetch fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));
  render(<ColorExplorer onLoadColors={vi.fn()} />);

  await waitFor(() => {
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });
});
