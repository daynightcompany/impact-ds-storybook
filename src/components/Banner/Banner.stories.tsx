import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Banner } from './Banner';
import { Button } from '../Button/Button';

const meta = {
  title: 'Impact DS/Banner',
  component: Banner,
  tags: ['autodocs'],
  args: { onClose: fn() },
  argTypes: {
    button: { control: 'inline-radio', options: ['Icon', 'Ghost', 'Prim & Sec', 'None', 'Primary'] },
    closeButton: { control: 'boolean' },
    title: { control: 'text' },
    children: { control: 'text' },
    tertiaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
    primaryButton: { control: 'text' },
    link: { control: 'text' },
  },
  decorators: [
    // The white cards need a panel behind them, like the grey one of the Figma page.
    (Story) => (
      <div
        style={{
          width: '100%',
          maxWidth: 880,
          boxSizing: 'border-box',
          padding: 24,
          borderRadius: 16,
          background: 'color-mix(in srgb, var(--theme-color-border-tertiary) 40%, transparent)',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Banner" component set (node 9587:6765) in the SMAL Impact Design System file. A message bar in five layouts, named by the Figma property Button: `Icon` (title, text, close icon), `Ghost` (title, text, a Tertiary button), `Prim & Sec` (title, text, a Secondary and a Primary button), `None` (one slim line with a link and a close icon) and `Primary` (a full-width bar in the brand orange with a large text and a Primary button). Title is on in the first three layouts and off in the other two, as in Figma; Close button shows or hides the close icon of `Icon` and `None`. The text takes the room the buttons leave and the buttons drop under it when it would get narrower than its minimum width (272, 300 for `Primary`): resize the story or use the Breakpoint switch in the toolbar to see it. A button slot takes `true` (the default of the layout), a label, a node, or `false`. The banner does not hide itself: `onClose` is yours. Source of truth for variants: Figma. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Banner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Button=Icon, Title on, Close button on. */
export const Default: Story = {};

export const WithGhostButton: Story = {
  args: { button: 'Ghost', onClose: undefined },
};

export const WithTwoButtons: Story = {
  args: { button: 'Prim & Sec', onClose: undefined },
};

export const Slim: Story = {
  args: { button: 'None' },
};

export const Promo: Story = {
  args: { button: 'Primary', onClose: undefined },
};

/** The five Figma variants on one canvas, like the component page. */
export const AllLayouts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Banner button="Icon" onClose={fn()} />
      <Banner button="Ghost" />
      <Banner button="Prim & Sec" />
      <Banner button="None" onClose={fn()} />
      <Banner button="Primary" />
    </div>
  ),
};

/** The text and the buttons are yours: strings are labels, nodes replace the default button. */
export const CustomContent: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Banner
        button="Prim & Sec"
        title="Unsaved changes"
        secondaryButton="Keep editing"
        primaryButton="Save and close"
      >
        You have edits in 3 files that are not saved yet.
      </Banner>
      <Banner
        button="Ghost"
        title="Update available"
        tertiaryButton={
          <Button hierarchy="Tertiary" size="L" onClick={fn()}>
            Release notes
          </Button>
        }
      >
        Version 2.4 is ready to install.
      </Banner>
      <Banner button="None" link="Verify now ›">
        Your email is not verified.
      </Banner>
    </div>
  ),
};

/** Press the close icon: the banner is hidden by the story, not by the component. */
export const Dismissible: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(true);
    return open ? (
      <Banner {...args} role="status" onClose={() => setOpen(false)} />
    ) : (
      <Button hierarchy="Secondary" size="L" onClick={() => setOpen(true)}>
        Show the banner again
      </Button>
    );
  },
  parameters: { chromatic: { disableSnapshot: true } },
};
