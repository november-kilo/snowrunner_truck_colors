import { useEffect, useState } from 'react';
import type { ColorScheme } from '../logic/types';
import truckNames from '../data/truck-names.json';

interface TruckData {
  truckNames: string[];
  truckColors: ColorScheme[];
  loading: boolean;
  error: string | null;
}

export function useTruckData(): TruckData {
  const [truckColors, setTruckColors] = useState<ColorScheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/truck-colors.json')
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load truck colors: ${res.status}`);
        return res.json() as Promise<ColorScheme[]>;
      })
      .then((data) => {
        setTruckColors(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { truckNames, truckColors, loading, error };
}
