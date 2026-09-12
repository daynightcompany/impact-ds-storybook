import type { Preview, Renderer } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import '../src/styles/tokens.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
  },

  decorators: [
    withThemeByDataAttribute<Renderer>({
      themes: {
        Light: 'light',
        Dark: 'impact-dark-mode',
        SMAL: 'smal',
      },
      defaultTheme: 'Light',
      attributeName: 'data-color',
      parentSelector: 'html',
    }),
  ],
};

export default preview;
