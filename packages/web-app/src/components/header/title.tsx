import React from 'react';
import { Typography } from '@mui/material';

export const HeaderTitle = (props) => (
  <Typography
    sx={{
      flex: '1 1 auto',
      whiteSpace: 'pre',
      textOverflow: 'ellipsis',
      overflow: 'hidden'
    }}
    {...props}
  />
);
