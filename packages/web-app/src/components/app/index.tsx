import React from 'react';
import { Redirect, Route, BrowserRouter as Router, Switch } from 'react-router-dom';

import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { VisualizePage } from '~/routes/visualize';
import { ExplorePage } from '~/routes/explore';
import { AnalyzePage } from '~/routes/analyze';
import { Root } from '~/components/root';
import { AppDrawer } from '~/components/drawer';
import { AppHeader } from '~/components/header';
import { useThemeSettings } from '~/hooks/theming';
import { AppDrawerProvider } from '~/contexts';

const Main = styled('div')({
  flex: '1 1 auto',
  display: 'flex'
});

// export type AppDrawer = {
//   isOpen: boolean;
//   addExtension: (key: string, component: React.ReactNode, position?: 'start' | 'end') => void;
//   removeExtension: (key: string) => void;
//   toggle: () => void;
//   show: () => void;
//   hide: () => void;
// };

export const App: React.FC = () => {
  const { theme, toggleDarkMode } = useThemeSettings();
  // const [open, setOpen] = useState(false);
  // const [drawerExtensions, setDrawerExtensions] = useState<
  //   { key: string; component: React.ReactNode }[]
  // >([]);

  // const drawer = {
  //   isOpen: open,
  //   addExtension: (key: string, component: React.ReactNode, position = 'end'): void => {
  //     position === 'start'
  //       ? setDrawerExtensions([{ key, component }, ...drawerExtensions])
  //       : setDrawerExtensions([...drawerExtensions, { key, component }]);
  //   },
  //   removeExtension: (key: string): void => {
  //     setDrawerExtensions(_.filter(drawerExtensions, (item) => item.key === key));
  //   },
  //   toggle: () => setOpen(!open),
  //   show: () => !open && setOpen(true),
  //   hide: () => open && setOpen(false)
  // };

  console.log(`App rendering with ${theme.palette.type}...`);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppDrawerProvider>
          <Root>
            <AppDrawer />
            <AppHeader toggleDarkMode={toggleDarkMode} />
            <Main>
              <Switch>
                <Route
                  exact
                  path="/explore"
                  render={(routeProps) => <ExplorePage {...routeProps} />}
                />
                <Route
                  exact
                  path="/visualize"
                  render={(routeProps) => <VisualizePage {...routeProps} />}
                />
                <Route
                  exact
                  path="/analyze"
                  render={(routeProps) => <AnalyzePage {...routeProps} />}
                />
                <Redirect to="/visualize" />
              </Switch>
            </Main>
          </Root>
        </AppDrawerProvider>
      </Router>
    </ThemeProvider>
  );
};
