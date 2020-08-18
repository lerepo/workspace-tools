import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import useWindowDimensions from '~/hooks/useWindowDimensions';
import { useAppDrawer } from '~/contexts/use-app-drawer';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    float: 'right',
    transition: 'width 180ms',
    minHeight: '100vh',
    height: '100vh',
    overflow: 'hidden'
  }
}));

export const Root: React.FC = ({ children }) => {
  const [width, setWidth] = useState(0);
  const { width: vwidth } = useWindowDimensions();
  const drawer = useAppDrawer();

  const theme = useTheme();
  const classes = useStyles();
  const smup = useMediaQuery(theme.breakpoints.up('sm'));
  const lgup = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    setWidth(vwidth);
    if (drawer) {
      if (lgup) {
        setWidth(vwidth - DRAWER_WIDTH);
      } else if (smup) {
        setWidth(drawer.isOpen ? vwidth - DRAWER_WIDTH : vwidth);
      }
    }
  }, [vwidth, lgup, smup, width, drawer]);

  return (
    <Box className={classes.root} width={width}>
      {children}
    </Box>
  );
};
