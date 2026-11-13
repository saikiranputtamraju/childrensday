export type FrameId =
  | 'sky-rainbow'
  | 'starlight-butterfly'
  | 'balloon-carnival'
  | 'sunny-meadow'
  | 'golden-superstar'
  | 'rainbow-kids'
  | 'superhero'
  | 'superstar'
  | 'balloon-party'
  | 'school-memories';

export type PastelThemeId = 'rainbow-celebration' | 'magical-pastel' | 'superstar-gold';

export interface PastelThemeConfig {
  id: PastelThemeId;
  name: string;
  swatchColors: [string, string, string];
  bgGradientClass: string;
  orb1Class: string;
  orb2Class: string;
  orb3Class: string;
  accentHex: string;
}

export interface FrameOption {
  id: FrameId;
  name: string;
  subtitle: string;
  accentColor: string;
  surfaceTint: string;
  borderColor: string;
  badgeText: string;
}

export interface PhotoTransform {
  zoom: number;
  offsetX: number; // normalized in canvas units (-600..600)
  offsetY: number; // normalized in canvas units (-720..720)
  rotation: number; // degrees
}

export interface WishItem {
  id: string;
  wish: string;
  quote: string;
  author: string;
  themeColor: string;
  surpriseMessage: string;
}
