import type { Meta, StoryObj } from '@storybook/react-vite';
import { SimpleTextBlock } from './SimpleTextBlock';

const meta = {
  title: 'Impact DS/Simple text block',
  component: SimpleTextBlock,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['L', 'M'] },
    eyebrow: { control: 'text' },
    children: { control: 'text' },
    subtitle: { control: 'text' },
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
          'Converted from the Figma "Text/Card text block" component set (node 9587:7484; "Simple text block" on its page) in the SMAL Impact Design System file. Source of truth for variants: Figma. An eyebrow, a title and a subtitle in a column, left aligned, for a card; "Eyebrow" and "Subtitle" are the `eyebrow` and `subtitle` props. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SimpleTextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Size=L, eyebrow and subtitle on. */
export const Default: Story = {};

export const Medium: Story = {
  args: { size: 'M' },
};

export const TitleOnly: Story = {
  name: 'Title only',
  args: { eyebrow: false, subtitle: false },
};

/** Both sizes, with and without the optional lines. Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 32 }}>
      <SimpleTextBlock size="L" />
      <SimpleTextBlock size="L" eyebrow={false} />
      <SimpleTextBlock size="L" subtitle={false} />
      <SimpleTextBlock size="M" />
      <SimpleTextBlock size="M" eyebrow={false} />
      <SimpleTextBlock size="M" subtitle={false} />
    </div>
  ),
};
