export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
};

import { THEME_MAP } from '../src/theming';

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      // array of plain string values or MenuItem shape (see below)
      items: [...THEME_MAP.keys()]
    }
  }
};

import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';

const getMuiTheme = (name) => {
  const options = THEME_MAP.get(name) || {};
  return createMuiTheme(options);
};

const withThemeProvider = (Story, context) => {
  const theme = getMuiTheme(context.globals.theme);
  return (
    <ThemeProvider theme={theme}>
      <Story {...context} />
    </ThemeProvider>
  );
};
export const decorators = [withThemeProvider];
