import React from 'react';
import { makeStyles, Theme } from '@material-ui/core';

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

const useStyles = makeStyles<Theme, { delay?: number }>({
  transition: {
    transitionDelay: (props) => `${props.delay}` || '0'
  }
});

export const Transition: React.FC<TransitionProps> = ({ delay, renderTransition, children }) => {
  const classes = useStyles({ delay });

  return renderTransition({
    className: classes.transition,
    children: <>{children}</>
  });
};
