import { ThemeOptions } from '@material-ui/core';

export type ThemeTone = 'light' | 'dark';

export interface AppTheme {
  name: string;
  tone: 'dark' | 'light';
  options: ThemeOptions;
}
