import { createTheme } from '@mui/material/styles';
import { AppTheme } from './theme';

// const themeMap = ({ secondary, background }) => ({
//   components: {
//     MuiDrawer: {
//       styleOverrides: {
//         paper: {
//           width: DRAWER_WIDTH,
//           flexShrink: 0,
//           backgroundColor: background.default,
//           '@media (min-width:600px)': {
//             backgroundColor: `rgba(${background.default}, 0.2)`
//           }
//         }
//       }
//     },
//     MuiTextField: {
//       styleOverrides: {
//         root: {
//           width: '32rem',
//           maxWidth: '100%'
//         }
//       }
//     },
//     MuiTooltip: {
//       styleOverrides: {
//         tooltip: {
//           backgroundColor: secondary.main,
//           color: 'inherit'
//         },
//         arrow: {
//           color: secondary.main
//         }
//       }
//     }
//   }
// });

// const PALETTE = {
//   light: {
//     palette: {
//       mode: 'light',
//       primary: {
//         main: '#c1dfff',
//         dark: '#90adcc',
//         light: '#f4ffff'
//       },
//       secondary: {
//         main: '#fff869',
//         light: '#ffff9b',
//         dark: '#c9c536'
//       },
//       error: {
//         main: '#db2624'
//       },
//       background: {
//         default: '#fdf9f6'
//       }
//     }
//   },
//   dark: {
//     palette: {
//       mode: 'dark',
//       primary: {
//         main: '#040424',
//         light: '#E70447',
//         dark: '#04DBFF'
//       },
//       secondary: {
//         main: '#DA0443',
//         light: '#E70447',
//         dark: '#C0043B'
//       },
//       error: {
//         main: '#C2043C'
//       },
//       background: {
//         default: '#1B2033'
//       }
//     }
//   }
// };

const lightTheme: AppTheme = {
  name: 'default',
  tone: 'light',
  options: createTheme({
    palette: {
      mode: 'light'
    }
  })
};

const darkTheme: AppTheme = {
  name: 'default',
  tone: 'dark',
  options: createTheme({
    palette: {
      mode: 'dark'
    }
  })
};

export default [lightTheme, darkTheme];
