import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { PopupText } from './PopupText';

const meta = {
  title: 'Impact DS/Popup text',
  component: PopupText,
  tags: ['autodocs'],
  args: { onCtaClick: fn() },
  argTypes: {
    headline: { control: 'text' },
    preTitle: { control: 'text' },
    cta: { control: 'text' },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/PopupTextStyle" component (node 9587:7449) in the SMAL Impact Design System file. Source of truth for variants: Figma. A headline, a pre title and a body text over a Secondary XL button, for the content of a popup or a dialog; "Pre title" and "CTA" are the `preTitle` and `cta` props. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof PopupText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: pre title and CTA on. */
export const Default: Story = {};

export const WithoutCta: Story = {
  name: 'Without CTA',
  args: { cta: false },
};

export const WithoutPreTitle: Story = {
  name: 'Without pre title',
  args: { preTitle: false },
};

export const TextOnly: Story = {
  name: 'Text only',
  args: { preTitle: false, cta: false },
};

/** Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 64 }}>
      <PopupText />
      <PopupText cta={false} />
      <PopupText preTitle={false} />
      <PopupText preTitle={false} cta={false} />
    </div>
  ),
};
