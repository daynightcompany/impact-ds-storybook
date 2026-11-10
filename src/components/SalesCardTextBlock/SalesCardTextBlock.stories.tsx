import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SalesCardTextBlock } from './SalesCardTextBlock';

const meta = {
  title: 'Impact DS/Sales card text block',
  component: SalesCardTextBlock,
  tags: ['autodocs'],
  args: { onPrimaryClick: fn(), onSecondaryClick: fn() },
  argTypes: {
    fullPrice: { control: 'text' },
    discountPrice: { control: 'text' },
    productName: { control: 'text' },
    slogan: { control: 'text' },
    primaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "SalesCardsTextStyle/SalesCardsTextStyle" component (node 9587:7464) in the SMAL Impact Design System file. Source of truth for variants: Figma. Two prices, the name of a product and a slogan, over two L buttons (Primary and Secondary); it is as wide as the space it is in, at most 514, and its height is what it holds. The buttons stand under the text when the text would get narrower than 272, and stack when they would get narrower than 176 each or than their labels need. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SalesCardTextBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default. */
export const Default: Story = {};

export const OnePrice: Story = {
  name: 'One price',
  args: { discountPrice: false },
};

export const OneButton: Story = {
  name: 'One button',
  args: { secondaryButton: false },
};

/** Long labels: a button is never narrower than its label, so the buttons stack as soon as they do not fit side by side. */
export const LongLabels: Story = {
  name: 'Long labels',
  args: { primaryButton: 'Accept necessary only', secondaryButton: 'Manage preferences' },
};

/** At 375 wide: the card is 375, the buttons stack. */
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
      <SalesCardTextBlock />
      <SalesCardTextBlock discountPrice={false} />
      <SalesCardTextBlock secondaryButton={false} />
    </div>
  ),
};
