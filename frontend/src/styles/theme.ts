/**
 * Re-export theme from the centralized core theme module.
 * Existing code imports from @styles/theme — maintain compatibility.
 */
export { lightTheme as theme, lightTheme, darkTheme } from '@core/theme';
