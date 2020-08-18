import React, { createContext } from 'react';

export type AppDrawerContextType =
  | {
      isOpen: boolean;
      extensions: React.ReactNode[];
      addExtension: (key: string, component: React.ReactNode, position?: 'start' | 'end') => void;
      removeExtension: (key: string) => void;
      toggle: () => void;
      show: () => void;
      hide: () => void;
    }
  | undefined;

export const AppDrawerContext = createContext<AppDrawerContextType>(undefined);
if (APP_IS_PRODUCTION) {
  AppDrawerContext.displayName = 'AppDrawerContext';
}
