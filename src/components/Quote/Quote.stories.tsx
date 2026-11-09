import type { Meta, StoryObj } from '@storybook/react-vite';
import { Quote } from './Quote';

const meta = {
  title: 'Impact DS/Quote',
  component: Quote,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['L', 'M', 'S'] },
    children: { control: 'text' },
    author: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 924 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Quote" component set (node 9587:7416) in the SMAL Impact Design System file. Source of truth for variants: Figma. Size L is a large statement in a purple to wine gradient on a card, M a centred quote with its author on a card (with spacing/6xl of room around the card, as drawn), S an italic serif quote with the author in semi bold under it. It is a figure with a blockquote, and a figcaption when there is an author. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Size=L. */
export const Default: Story = {};

/** 816 wide, like the Figma M variant (it fills the space it is in). */
export const Medium: Story = {
  args: { size: 'M' },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 816 }}>
        <Story />
      </div>
    ),
  ],
};

export const Small: Story = {
  args: { size: 'S' },
};

/** All three sizes. Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 48 }}>
      <Quote size="L" />
      {/* The Figma M variant is 816 wide. */}
      <div style={{ width: '100%', maxWidth: 816, justifySelf: 'center' }}>
        <Quote size="M" />
      </div>
      <Quote size="S" />
    </div>
  ),
};
