import type { Preview } from '@storybook/react-vite';
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

  globalTypes: {
    theme: {
      description: 'Impact DS color theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'impact-dark-mode', title: 'Dark' },
          { value: 'smal', title: 'SMAL' },
        ],
        dynamicTitle: true,
      },
    },
    device: {
      description: 'Impact DS device / breakpoint set',
      toolbar: {
        title: 'Device',
        icon: 'browser',
        items: [
          { value: 'desktop', title: 'Desktop' },
          { value: 'mobile', title: 'Mobile' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
    device: 'desktop',
  },

  decorators: [
    (Story, context) => {
      const { theme, device } = context.globals;

      const wrapperProps: Record<string, string> = {};
      if (theme && theme !== 'light') {
        wrapperProps['data-color'] = theme;
      }
      if (device === 'mobile') {
        wrapperProps['data-font'] = 'impact-mobile';
        wrapperProps['data-breakpoint'] = '375-mobile';
        wrapperProps['data-spacing'] = 'impact-mobile';
        wrapperProps['data-radius'] = 'impact-mobile';
      }

      return (
        <div
          {...wrapperProps}
          style={{
            background: 'var(--color-interactive-idle-background)',
            color: 'var(--color-interactive-idle-primary-2)',
            width: '100%',
            height: 'fit-content',
            alignSelf: 'flex-start',
            flex: 'none',
            padding: 'var(--spacing-spacing-m)',
            boxSizing: 'border-box',
            transition: 'background-color 0.15s ease, color 0.15s ease',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
