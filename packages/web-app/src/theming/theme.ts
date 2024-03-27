import { ThemeOptions } from '@mui/material';

export type ThemeTone = 'light' | 'dark';

export interface AppTheme {
  name: string;
  tone: 'dark' | 'light';
  options: ThemeOptions;
}
