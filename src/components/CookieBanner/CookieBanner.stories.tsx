import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CookieBanner } from './CookieBanner';
import { Button } from '../Button/Button';

const meta = {
  title: 'Impact DS/Cookie banner',
  component: CookieBanner,
  tags: ['autodocs'],
  args: { onAccept: fn(), onReject: fn() },
  argTypes: {
    children: { control: 'text' },
    primaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', padding: '0 0 48px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Cookie banner" component (node 9587:6802) in the SMAL Impact Design System file. A card with the text on one side and two XL buttons (Primary and Secondary) on the other, on the primary background with Shadow L. It fills the width it is in: the text takes half of the row and the buttons the other half; when the text would get narrower than 287 the buttons drop under it, and when each button would get narrower than 176 they stack over the full width, as on a phone. The banner does not position itself: place it at the edge of the screen. Give it `role="region"` with an `aria-label`, or `role="dialog"`, as it suits the page. The labels of the buttons are Figma\'s placeholders ("Button" and "Reject all"); pass a string or a node to change them. Source of truth for variants: Figma. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CookieBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the texts of the Figma component. */
export const Default: Story = {
  args: { role: 'region', 'aria-label': 'Cookie consent' },
};

/** Labels that say what the buttons do. */
export const RealLabels: Story = {
  args: {
    role: 'region',
    'aria-label': 'Cookie consent',
    primaryButton: 'Accept all',
    secondaryButton: 'Reject all',
  },
};

/** At 375 wide: the text over two full width buttons. */
export const Narrow: Story = {
  args: { role: 'region', 'aria-label': 'Cookie consent' },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
};

export const OneButton: Story = {
  args: { role: 'region', 'aria-label': 'Cookie consent', secondaryButton: false, primaryButton: 'Got it' },
};

/** Your own buttons replace the default ones. */
export const CustomButtons: Story = {
  args: {
    role: 'region',
    'aria-label': 'Cookie consent',
    primaryButton: (
      <Button hierarchy="Primary" size="XL" onClick={fn()}>
        Accept necessary only
      </Button>
    ),
    secondaryButton: (
      <Button hierarchy="Secondary" size="XL" onClick={fn()}>
        Manage preferences
      </Button>
    ),
  },
};

/** Press a button: the story hides the banner, the component does not. */
export const Dismissible: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return open ? (
      <CookieBanner
        {...args}
        role="region"
        aria-label="Cookie consent"
        primaryButton="Accept all"
        onAccept={() => setOpen(false)}
        onReject={() => setOpen(false)}
      />
    ) : (
      <Button hierarchy="Secondary" size="L" onClick={() => setOpen(true)}>
        Show the banner again
      </Button>
    );
  },
  parameters: { chromatic: { disableSnapshot: true } },
};
