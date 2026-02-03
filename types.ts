
export interface PosterConfig {
  url: string;
  qrColor: string;
  qrBgColor: string;
  qrSize: number;
  qrOpacity: number;
  qrPosition: 'center' | 'top-right' | 'bottom-left' | 'bottom-right';
  backgroundPrompt: string;
  backgroundImageUrl: string | null;
  theme: 'minimal' | 'cyberpunk' | 'vintage' | 'nature' | 'abstract';
  title: string;
  subtitle: string;
}

export type ThemeType = 'minimal' | 'cyberpunk' | 'vintage' | 'nature' | 'abstract';
