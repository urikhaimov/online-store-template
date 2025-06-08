export interface ThemeConfig {
  storeName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
  mode?: 'light' | 'dark'; // <- here
  homeLayout?: 'grid' | 'list';
  features?: {
    showHeroSlider?: boolean;
    enableRatings?: boolean;
  };
}
