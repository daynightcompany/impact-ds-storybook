import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ComplexTextBlock } from './ComplexTextBlock';

const meta = {
  title: 'Impact DS/Complex text block',
  component: ComplexTextBlock,
  tags: ['autodocs'],
  args: { onPrimaryClick: fn(), onSecondaryClick: fn() },
  argTypes: {
    uptitle: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    quote: { control: 'text' },
    bodyText: { control: 'text' },
    primaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/Complex text block" component (node 9587:7512) in the SMAL Impact Design System file. Source of truth for variants: Figma. An uptitle, a title, a subtitle, a quote, a body text and a row of two XL buttons, left aligned in a column at most 640 wide, centred on the surface colour; every line is a boolean in Figma and a prop here (`false` hides it, a string or a node replaces it). It is as wide as the space it is in and as tall as its content. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof ComplexTextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: everything on. */
export const Default: Story = {};

export const WithoutButtons: Story = {
  name: 'Without buttons',
  args: { cta: false },
};

export const OneButton: Story = {
  name: 'One button',
  args: { secondaryButton: false },
};

export const TitleAndBody: Story = {
  name: 'Title and body',
  args: { uptitle: false, subtitle: false, quote: false, cta: false },
};

/** At 375 wide: the padding is 40, and the buttons wrap. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 375, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
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
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 32 }}>
      <ComplexTextBlock />
      <ComplexTextBlock cta={false} />
      <ComplexTextBlock uptitle={false} subtitle={false} quote={false} />
    </div>
  ),
};
