import React, { PropsWithChildren, useState, useMemo } from 'react';

import { AppDrawerContextType, AppDrawerContext } from './app-drawer-context';

export const AppDrawerProvider: React.FC<PropsWithChildren> = ({
  children
}): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const [drawerExtensions, setDrawerExtensions] = useState<
    { key: string; component: React.ReactNode }[]
  >([]);

  const drawer = useMemo<AppDrawerContextType>(
    () => ({
      isOpen: open,
      extensions: drawerExtensions.map((ext) => ext.component),
      addExtension: (
        key: string,
        component: React.ReactNode,
        position = 'end'
      ): void => {
        console.log(`add drawer extension: ${key}`);
        position === 'start'
          ? setDrawerExtensions([{ key, component }, ...drawerExtensions])
          : setDrawerExtensions([...drawerExtensions, { key, component }]);
      },
      removeExtension: (key: string): void => {
        console.log(`remove drawer extension: ${key}`);
        setDrawerExtensions(
          drawerExtensions.filter((item) => item.key === key)
        );
      },
      toggle: () => setOpen(!open),
      show: () => !open && setOpen(true),
      hide: () => open && setOpen(false)
    }),
    [drawerExtensions, open]
  );

  return (
    <AppDrawerContext.Provider value={drawer}>
      {children}
    </AppDrawerContext.Provider>
  );
};
