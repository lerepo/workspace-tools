import React, { PropsWithChildren, useEffect, useState } from 'react';

import { Box, useMediaQuery, useTheme } from '@mui/material';

import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useAppDrawer } from '@/contexts/use-app-drawer';

export const Root: React.FC<PropsWithChildren> = ({ children }) => {
  const [width, setWidth] = useState(0);
  const { width: vwidth } = useWindowDimensions();
  const drawer = useAppDrawer();

  const theme = useTheme();
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        float: 'right',
        transition: 'width 180ms',
        minHeight: '100vh',
        height: '100vh',
        overflow: 'hidden'
      }}
      width={width}
    >
      {children}
    </Box>
  );
};
