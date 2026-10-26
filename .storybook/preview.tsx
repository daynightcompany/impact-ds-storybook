import type { Decorator, Preview, ReactRenderer } from '@storybook/react-vite';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { useEffect } from 'storybook/preview-api';
import { applyBreakpoint } from '../src/styles/breakpoint';
import '../src/styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../src/styles/tokens.extras.css';
// Stopgap until the "Variables to Tokens" plugin exports text styles per mode:
// Mobile values for the Interactive-Label and paragraph text styles.
import '../src/styles/tokens.text-modes.css';
// Storybook-only styles (Docs background follows the theme).
import './preview.css';

/**
 * Breakpoint axis (Desktop is the default, Mobile is the 375 mode), driven by
 * the toolbar. The attribute names live in src/styles/breakpoint.ts, shared
 * with the useBreakpointTokens hook that apps use.
 *
 * Same approach as the theme switcher (see WORKFLOW.md): set the attributes
 * directly on <html> instead of wrapping the story in a <div>, so it also
 * works in Docs. addon-themes only supports one switcher, hence the custom
 * decorator for the second axis. Storybook follows the toolbar, not the
 * preview width, so the Viewport tool alone doesn't switch modes.
 */
const withBreakpoint: Decorator = (Story, context) => {
  const breakpoint = context.globals.breakpoint === 'mobile' ? 'mobile' : 'desktop';

  useEffect(() => {
    applyBreakpoint(breakpoint);
  }, [breakpoint]);

  return Story();
};

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

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },

  globalTypes: {
    breakpoint: {
      description: 'Breakpoint mode of the tokens (Desktop is the default)',
      toolbar: {
        title: 'Breakpoint',
        icon: 'browser',
        dynamicTitle: true,
        items: [
          { value: 'desktop', title: 'Desktop (1920)', icon: 'browser' },
          { value: 'mobile', title: 'Mobile (375)', icon: 'mobile' },
        ],
      },
    },
  },

  initialGlobals: {
    breakpoint: 'desktop',
  },

  decorators: [
    withThemeByDataAttribute<ReactRenderer>({
      themes: {
        Day: 'light',
        Night: 'impact-night-mode',
        SMAL: 'smal',
      },
      defaultTheme: 'Day',
      attributeName: 'data-theme',
      parentSelector: 'html',
    }),
    withBreakpoint,
  ],
};

export default preview;
