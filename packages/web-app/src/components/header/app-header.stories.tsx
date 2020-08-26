import React from 'react';
import { action } from '@storybook/addon-actions';

import { AppHeader } from './app-header';

export default {
  component: AppHeader,
  title: 'Application/AppHeader',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/
};

export const actionsData = {
  toggleDarkMode: action('toggleDarkMode')
};

export const Default = (): React.ReactNode => <AppHeader {...actionsData} />;
