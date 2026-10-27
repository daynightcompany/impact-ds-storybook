import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DialogFooter } from './DialogFooter';
import { Button } from '../Button/Button';

const meta = {
  title: 'Impact DS/Dialog footer',
  component: DialogFooter,
  tags: ['autodocs'],
  argTypes: {
    buttonWidth: { control: 'inline-radio', options: ['3 CTA', '2 CTA'] },
    layout: { control: 'inline-radio', options: ['Horizontal', 'Vertical'] },
    primaryButton: { control: 'boolean' },
    secondaryButton: { control: 'boolean' },
    tertiaryButton: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 640 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Dialog/Footer" component set (node 9587:6837) in the SMAL Impact Design System file. Button width is `3 CTA` (Tertiary at the start, Secondary and Primary at the end) or `2 CTA` (Secondary and Primary share the width, so Tertiary is never shown). Layout is Horizontal or Vertical. The booleans Primary, Secondary and Tertiary button show or hide a button: `true` shows the default button, a string is its label, a node replaces it. Buttons that share the width are at least 176px wide, so two of them wrap into a stack in a narrow dialog, as in Figma. In the wide footer the end group stays at the end when Tertiary is hidden (Figma moves it to the start). Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof DialogFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: 3 CTA, Horizontal, every button on. */
export const Default: Story = {};

export const TwoCTA: Story = {
  args: { buttonWidth: '2 CTA' },
  decorators: [
    (Story) => (
      <div style={{ width: 460 }}>
        <Story />
      </div>
    ),
  ],
};

export const Vertical: Story = {
  args: { layout: 'Vertical' },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
};

export const WithoutTertiary: Story = {
  args: { tertiaryButton: false },
};

export const PrimaryOnly: Story = {
  args: { tertiaryButton: false, secondaryButton: false },
};

export const CustomLabels: Story = {
  args: { tertiaryButton: 'Reset', secondaryButton: 'Cancel', primaryButton: 'Apply' },
};

export const CustomButtons: Story = {
  render: (args) => (
    <DialogFooter
      {...args}
      tertiaryButton={
        <Button hierarchy="Tertiary" size="L" onClick={fn()}>
          Clear all
        </Button>
      }
      secondaryButton={
        <Button hierarchy="Secondary" size="L" onClick={fn()}>
          Cancel
        </Button>
      }
      primaryButton={
        <Button hierarchy="Primary" size="L" onClick={fn()}>
          Save changes
        </Button>
      }
    />
  ),
};

export const AllVariants: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(
        [
          { label: '3 CTA · Horizontal', width: 640, props: {} },
          { label: '3 CTA · Horizontal · no tertiary', width: 640, props: { tertiaryButton: false } },
          { label: '2 CTA · Horizontal', width: 460, props: { buttonWidth: '2 CTA' as const } },
          { label: '3 CTA · Vertical', width: 375, props: { layout: 'Vertical' as const } },
          { label: '2 CTA · Horizontal in a 327 dialog (wraps)', width: 327, props: { buttonWidth: '2 CTA' as const } },
        ] as const
      ).map(({ label, width, props }) => (
        <div key={label} style={{ display: 'grid', gap: 4, width }}>
          <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
          <DialogFooter {...props} />
        </div>
      ))}
    </div>
  ),
};
