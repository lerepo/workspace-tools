import defaultTheme from '@material-ui/core/styles/defaultTheme';
import { fade } from '@material-ui/core/styles/colorManipulator';

import { AppTheme } from './theme';

const themeMap = ({ secondary, background }) => ({
  overrides: {
    MuiDrawer: {
      paper: {
        width: DRAWER_WIDTH,
        flexShrink: 0,
        backgroundColor: background.default,
        [defaultTheme.breakpoints.up('sm')]: {
          backgroundColor: fade(background.default, 0.2)
        }
      }
    },
    MuiTextField: {
      root: {
        width: '32rem',
        maxWidth: '100%'
      }
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: secondary.main,
        color: 'inherit'
      },
      arrow: {
        color: secondary.main
      }
    }
  }
});

const PALETTE = {
  light: {
    palette: {
      type: 'light' as 'light' | 'dark' | undefined,
      primary: {
        main: '#c1dfff',
        dark: '#90adcc',
        light: '#f4ffff'
      },
      secondary: {
        main: '#fff869',
        light: '#ffff9b',
        dark: '#c9c536'
      },
      error: {
        main: '#db2624'
      },
      background: {
        default: '#fdf9f6'
      }
    }
  },
  dark: {
    palette: {
      type: 'dark' as 'light' | 'dark' | undefined,
      primary: {
        main: '#040424',
        light: '#E70447',
        dark: '#04DBFF'
      },
      secondary: {
        main: '#DA0443',
        light: '#E70447',
        dark: '#C0043B'
      },
      error: {
        main: '#C2043C'
      },
      background: {
        default: '#1B2033'
      }
    }
  }
};

const lightTheme: AppTheme = {
  name: 'default',
  tone: 'light',
  options: {
    ...PALETTE.light,
    ...themeMap(PALETTE.light.palette)
  }
};

const darkTheme: AppTheme = {
  name: 'default',
  tone: 'dark',
  options: {
    ...PALETTE.dark,
    ...themeMap(PALETTE.dark.palette)
  }
};

export default [lightTheme, darkTheme];
