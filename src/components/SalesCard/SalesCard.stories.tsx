import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SalesCard } from './SalesCard';

const meta = {
  title: 'Impact DS/Sales card',
  component: SalesCard,
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
          'Converted from the Figma "Card/Sales card" component (node 9587:7737) in the SMAL Impact Design System file. Source of truth for variants: Figma. The Sales card text block on a card: two prices, the name of a product and a slogan, over two L buttons (Primary and Secondary), on surface/primary with corner radius m and spacing/l of padding. It is as wide as the space it is in, at most 514 and at least 324; the buttons stand under the text when the text would get narrower than 272, and stack when they would get narrower than 176 each or than their labels need. It takes the props of the text block. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SalesCard>;

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

/** At its least width, 324: the buttons stack. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 324 }}>
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
    <div style={{ display: 'grid', gap: 32 }}>
      <SalesCard />
      <SalesCard discountPrice={false} />
      <SalesCard secondaryButton={false} />
    </div>
  ),
};
