import type { Preview } from '@storybook/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../src/design/theme';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#F7F7F5' },
        { name: 'dark', value: '#090A0B' },
        { name: 'white', value: '#FFFFFF' },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme === 'dark' ? darkTheme : lightTheme;
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: 'CricketOS Theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'circlehollow' },
          { value: 'dark', title: 'Dark', icon: 'circle' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;
