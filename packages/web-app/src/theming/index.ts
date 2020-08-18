import { ThemeOptions } from '@material-ui/core';
import { AppTheme } from './theme';
import defaultThemes from './default';

const themes = [...defaultThemes];
const THEME_MAP = new Map<string, ThemeOptions>();
themes.map((theme: AppTheme) => {
  THEME_MAP.set(`${theme.name}-${theme.tone}`, theme.options);
});

export { THEME_MAP };
export * from './theme';
