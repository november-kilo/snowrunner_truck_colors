export interface HSB {
  hue: number;
  saturation: number;
  brightness: number;
}

export interface SchemeColor {
  hex: string;
  hsb: HSB;
}

export interface ColorScheme {
  trucks: string[];
  colors: Record<string, SchemeColor>;
}

export type EqualityClass = 'allEqual' | 'someEqual' | 'noneEqual';