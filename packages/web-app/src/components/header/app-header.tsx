import React from 'react';

import { Fade, AppBar, Toolbar, Hidden, IconButton, Tooltip } from '@material-ui/core';
import { Menu, MenuOpen, GitHub, InvertColors } from '@material-ui/icons';

import { Transition } from '~/components/transition';
import { HeaderTitle } from './title';
import { useAppDrawer } from '~/contexts/use-app-drawer';

export type HeaderProps = {
  toggleDarkMode: () => void;
};

export const AppHeader: React.FC<HeaderProps> = ({ toggleDarkMode }) => {
  const drawer = useAppDrawer();

  const triggerIcon: React.ReactNode = drawer && drawer.isOpen ? <MenuOpen /> : <Menu />;

  return (
    <Transition delay={337} renderTransition={(props) => <Fade in timeout={775} {...props} />}>
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          {drawer && (
            <Hidden lgUp>
              <IconButton edge="start" aria-label="open navigation drawer" onClick={drawer.toggle}>
                <Hidden smUp>{triggerIcon}</Hidden>
                <Hidden xsDown>{triggerIcon}</Hidden>
              </IconButton>
            </Hidden>
          )}
          <Hidden smUp>
            <HeaderTitle variant="h6" color="textPrimary">
              @yarnpkg/berry
            </HeaderTitle>
          </Hidden>
          <Hidden xsDown>
            <HeaderTitle variant="h5" color="textPrimary">
              @yarnpkg/berry
            </HeaderTitle>
          </Hidden>
          <Hidden xsDown>
            <Tooltip title="Open project repo on GitHub" placement="bottom">
              <IconButton href="https://github.com/abdes/yarn-plugins" target="_blank">
                <GitHub />
              </IconButton>
            </Tooltip>
          </Hidden>
          <Tooltip title="Toggle color scheme" placement="bottom">
            <IconButton edge="end" onClick={toggleDarkMode}>
              <InvertColors />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    </Transition>
  );
};
