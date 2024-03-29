import React from 'react';

import {
  Fade,
  AppBar,
  Toolbar,
  Hidden,
  IconButton,
  Tooltip
} from '@mui/material';
import { Menu, MenuOpen, GitHub, InvertColors } from '@mui/icons-material';

import { Transition } from '@/components/transition';
import { useAppDrawer } from '@/contexts/use-app-drawer';

import { HeaderTitle } from './title';

export type HeaderProps = {
  toggleDarkMode: () => void;
};

export const AppHeader: React.FC<HeaderProps> = ({ toggleDarkMode }) => {
  const drawer = useAppDrawer();

  const triggerIcon: React.ReactNode =
    drawer && drawer.isOpen ? <MenuOpen /> : <Menu />;

  return (
    <Transition
      delay={337}
      renderTransition={(props) => <Fade in timeout={775} {...props} />}
    >
      <AppBar position="sticky" color="primary" elevation={2}>
        <Toolbar>
          {drawer && (
            <Hidden lgUp>
              <IconButton
                edge="start"
                aria-label="open navigation drawer"
                onClick={drawer.toggle}
              >
                <Hidden smUp>{triggerIcon}</Hidden>
                <Hidden xsDown>{triggerIcon}</Hidden>
              </IconButton>
            </Hidden>
          )}
          <Hidden smUp>
            <HeaderTitle variant="h6" color="textPrimary">
              Workspace Tools (TODO: use project name)
            </HeaderTitle>
          </Hidden>
          <Hidden xsDown>
            <HeaderTitle variant="h5" color="textPrimary">
              Workspace Tools (TODO: use project name)
            </HeaderTitle>
          </Hidden>
          <Hidden xsDown>
            <Tooltip title="Open project repo on GitHub" placement="bottom">
              <IconButton
                href="https://github.com/abdes/yarn-plugins"
                target="_blank"
              >
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
