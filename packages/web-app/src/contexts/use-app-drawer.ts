import React from 'react';
import { AppDrawerContext, AppDrawerContextType } from './app-drawer-context';

export const useAppDrawer = (): AppDrawerContextType => {
  const drawer = React.useContext(AppDrawerContext);

  if (ENV_IS_PRODUCTION) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue(drawer);
  }

  return drawer;
};
