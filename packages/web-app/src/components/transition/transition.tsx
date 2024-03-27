import React from 'react';
import { Box } from '@mui/material';

interface TransitionInjectedProps {
  className: string;
  children: JSX.Element;
}

interface TransitionProps {
  delay?: number;
  className?: string;
  renderTransition: (props: TransitionInjectedProps) => JSX.Element;
  children?: JSX.Element;
}

export const Transition: React.FC<TransitionProps> = ({
  delay,
  renderTransition,
  children
}) => {
  return renderTransition({
    className: '',
    children: (
      <Box
        sx={{
          transitionDelay: `${delay || 0}s`
        }}
      >
        {children}
      </Box>
    )
  });
};
