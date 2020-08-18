import { useCallback, useReducer, useEffect } from 'react';
import { Theme, createMuiTheme } from '@material-ui/core';
import { THEME_MAP, ThemeTone } from '~/theming';

// This the media query and the mql used to get the browser dark mode
// preference, created once and used forever.
const PREFER_DARK_QUERY_STRING = '(prefers-color-scheme: dark)';
const PREFER_DARK_MQL = matchMedia(PREFER_DARK_QUERY_STRING);
const schemeFromMql = (fallbackValue: ThemeTone): ThemeTone =>
  PREFER_DARK_MQL ? (PREFER_DARK_MQL.matches ? 'dark' : 'light') : fallbackValue;

const SETTINGS_STORAGE_KEY = 'theme';

type PersistedState = {
  themeName: string;
  themeTone: ThemeTone;
};
type State = PersistedState & {
  theme: Theme;
};

const initialState = (fallback: ThemeTone): State => {
  console.log(`initialState: fallback: ${fallback}`);
  const preferredColorScheme = schemeFromMql(fallback);
  console.log(`initialState: preferredColorScheme: ${preferredColorScheme}`);

  let themeName = 'default';
  let themeTone = preferredColorScheme;

  let persistedSettings: PersistedState | undefined;
  try {
    console.log('initialState: get item from storage');
    // Get from local storage by key
    const item = localStorage.getItem(SETTINGS_STORAGE_KEY);
    // Parse stored json or if none return initialValue
    console.log('initialState: item= ', item);
    item && (persistedSettings = JSON.parse(item));
    console.log('initialState: parsed= ', persistedSettings);
  } catch (error) {
    // If error also return initialValue
    console.log(error);
  }

  persistedSettings && ({ themeName, themeTone } = persistedSettings);
  console.log(`initialState: getMuiTheme(${themeName}, ${themeTone})`);
  const theme = getMuiTheme(themeName, themeTone);
  console.log(`initialState: new theme is (${theme.palette.type})`);
  return {
    themeName,
    themeTone,
    theme
  };
};

const CHANGE_THEME_ACTION = 'change theme';
const TOGGLE_TONE_ACTION = 'toggle tone';
const ENABLE_DARK_MODE_ACTION = 'enable dark mode';
const ENABLE_LIGHT_MODE_ACTION = 'enable light mode';
const UPDATE_TONE_ACTION = 'update tone from value or mql';

type ActionBaseType = {
  type:
    | typeof CHANGE_THEME_ACTION
    | typeof TOGGLE_TONE_ACTION
    | typeof ENABLE_DARK_MODE_ACTION
    | typeof ENABLE_LIGHT_MODE_ACTION
    | typeof UPDATE_TONE_ACTION;
};

type ChangeThemeActionType = ActionBaseType & {
  name: string;
  tone?: ThemeTone;
};

type ToggleToneActionType = ActionBaseType;

type EnableDarkModeActionType = ActionBaseType;

type EnableLightModeActionType = ActionBaseType;

type UpdateToneActionType = ActionBaseType & {
  tone?: ThemeTone;
};

type ActionType =
  | ChangeThemeActionType
  | ToggleToneActionType
  | EnableDarkModeActionType
  | EnableLightModeActionType
  | UpdateToneActionType;

const reducer = (state: State, action: ActionType) => {
  switch (action.type) {
    case TOGGLE_TONE_ACTION: {
      const themeTone: ThemeTone = state.themeTone === 'light' ? 'dark' : 'light';
      return {
        ...state,
        themeTone,
        theme: getMuiTheme(state.themeName, themeTone)
      };
    }
    case UPDATE_TONE_ACTION: {
      const typedAction = action as UpdateToneActionType;
      const newTone = typedAction.tone ? typedAction.tone : schemeFromMql(state.themeTone);
      return newTone !== state.themeTone
        ? {
            ...state,
            themeTone: newTone,
            theme: getMuiTheme(state.themeName, newTone)
          }
        : state;
    }
    case ENABLE_DARK_MODE_ACTION: {
      if (state.themeTone !== 'dark') {
        return {
          ...state,
          themeTone: 'dark' as ThemeTone,
          theme: getMuiTheme(state.themeName, 'dark')
        };
      } else return state;
    }
    case ENABLE_LIGHT_MODE_ACTION: {
      if (state.themeTone !== 'light') {
        return {
          ...state,
          themeTone: 'light' as ThemeTone,
          theme: getMuiTheme(state.themeName, 'light')
        };
      } else return state;
    }
    case CHANGE_THEME_ACTION: {
      const typedAction = action as ChangeThemeActionType;
      !typedAction.tone && (typedAction.tone = state.themeTone);
      if (typedAction.name !== state.themeName || typedAction.tone !== state.themeTone) {
        return {
          ...state,
          themeName: typedAction.name,
          themeTone: typedAction.tone,
          theme: getMuiTheme(typedAction.tone, typedAction.tone),
          dontOverrideWithBrowserScheme: !!typedAction.tone
        };
      } else return state;
    }
    default:
      throw new Error();
  }
};

export type ThemeSettings = State & {
  changeTheme: (name: string, tone?: ThemeTone) => void;
  toggleDarkMode: () => void;
  enableDarkMode: () => void;
  enableLightMode: () => void;
};

const getMuiTheme = (name: string, tone: ThemeTone): Theme => {
  console.log('getMuiTheme', name, tone);
  const options = THEME_MAP.get(`${name}-${tone}`) || {};
  return createMuiTheme(options);
};

export const useThemeSettings = (): ThemeSettings => {
  console.log('useThemeSettings');
  // const preferredColorScheme = usePreferredColorScheme('light');
  const [state, dispatch] = useReducer(reducer, 'light', initialState);
  const { themeName, themeTone, theme } = state;

  // useEffect(() => {
  //   console.log(`useThemeSettings: scheme changed effect ${preferredColorScheme}`);
  //   dispatch({ type: CHANGE_TONE_ACTION, tone: preferredColorScheme });
  // }, [preferredColorScheme]);

  // This effect depends on the mql which never changes. Only its`matches`
  // property does. It registers an event listener on the mql to get
  // notified when `matches` changes and sipatches an action to update the
  // state through the reducer.
  // It only runs on initial render as well.
  useEffect((): void | (() => void) => {
    const onPreferredColorSchemeChanged = (): void => {
      console.log(`useThemeSettings: onPreferredColorSchemeChanged effect runs`);
      dispatch({ type: UPDATE_TONE_ACTION });
    };
    if (PREFER_DARK_MQL) {
      PREFER_DARK_MQL.addEventListener('change', onPreferredColorSchemeChanged, {
        passive: true
      });
      return () => {
        PREFER_DARK_MQL.removeListener(onPreferredColorSchemeChanged);
      };
    }
  }, []);

  useEffect(() => {
    console.log(`useThemeSettings: effect saving theme to local storage`);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ themeName, themeTone }));
    } catch (error) {
      console.log(error);
    }
  }, [themeName, themeTone]);

  const toggleDarkMode = useCallback(() => {
    console.log(`useThemeSettings: toggleDarkMode runs`);
    dispatch({ type: TOGGLE_TONE_ACTION });
  }, []);

  const enableDarkMode = useCallback(() => {
    console.log(`useThemeSettings: enableDarkMode runs`);
    dispatch({ type: ENABLE_DARK_MODE_ACTION });
  }, []);

  const enableLightMode = useCallback(() => {
    console.log(`useThemeSettings: enableLightMode runs`);
    dispatch({ type: ENABLE_LIGHT_MODE_ACTION });
  }, []);

  const changeTheme = useCallback((name: string, tone?: ThemeTone) => {
    console.log(`useThemeSettings: enableLightMode runs`);
    dispatch({ type: ENABLE_LIGHT_MODE_ACTION, name, tone });
  }, []);

  return {
    themeName: themeName,
    themeTone: themeTone,
    theme: theme,
    toggleDarkMode,
    enableDarkMode,
    enableLightMode,
    changeTheme
  };
};
