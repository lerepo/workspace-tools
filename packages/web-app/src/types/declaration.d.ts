// Add a declaration to enable importing of css and sass/scss modules in
// typescript files
declare module '*.module.scss';
declare module '*.module.sass';
declare module '*.module.css';
declare module '*.jpg';
declare module '*.png';

// Declare global variables defined by webpack DefinePlugin
declare const APP_VERSION: string;
declare const ENV_IS_PRODUCTION: boolean;
declare const ENV_IS_DEVELOPMENT: boolean;
declare const ENV_IS_UNIT_TESTING: boolean;
declare const DRAWER_WIDTH: number;
declare const SITE_COOKIE_PREFERRED_COLOR_SCHEME: string;
