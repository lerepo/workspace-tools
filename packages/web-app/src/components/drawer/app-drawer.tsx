import React from 'react';
import {
  Drawer as MuiDrawer,
  SwipeableDrawer,
  Hidden,
  makeStyles,
  Theme,
  Fade,
  Divider
} from '@material-ui/core';

import LOGO_LIGHT_IMAGE from '@/assets/lerepo-light.png';
import LOGO_DARK_IMAGE from '@/assets/lerepo-dark.png';

import { Transition } from '@/components/transition';
import { NavLinks } from './nav-links';
import { useAppDrawer } from '@/contexts/use-app-drawer';

const useStyles = makeStyles<Theme>((theme) => ({
  spacer: {
    height: '64px',
    backgroundPosition: 'center',
    backgroundSize: '80%',
    backgroundRepeat: 'no-repeat',
    backgroundImage: `url(${
      theme.palette.type === 'light' ? LOGO_LIGHT_IMAGE : LOGO_DARK_IMAGE
    })`,
    [theme.breakpoints.down('xs')]: {
      height: '48px'
    }
  }
}));

const Spacer: React.FC = () => {
  const classes = useStyles();
  return <div className={classes.spacer} />;
};

export const AppDrawer: React.FC = ({ children }) => {
  const drawer = useAppDrawer();

  const drawerContent = (
    <>
      <Spacer />
      <Divider />
      <NavLinks />
      <Divider />
      {children}
      {drawer?.extensions}
    </>
  );
  return drawer ? (
    <Transition
      renderTransition={(props) => <Fade in timeout={550} {...props} />}
    >
      <nav aria-label="navigation">
        <Hidden smUp>
          <SwipeableDrawer
            open={drawer.isOpen}
            onClose={drawer.toggle}
            onOpen={drawer.toggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            {drawerContent}
          </SwipeableDrawer>
        </Hidden>
        <Hidden only={['xs', 'lg', 'xl']}>
          <MuiDrawer variant="persistent" open={drawer.isOpen}>
            {drawerContent}
          </MuiDrawer>
        </Hidden>
        <Hidden mdDown>
          <MuiDrawer variant="permanent">{drawerContent}</MuiDrawer>
        </Hidden>
      </nav>
    </Transition>
  ) : (
    <></>
  );
};
