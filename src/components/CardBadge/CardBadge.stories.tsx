import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardBadge } from './CardBadge';

const meta = {
  title: 'Impact DS/Card badge',
  component: CardBadge,
  tags: ['autodocs'],
  argTypes: {
    state: { control: 'inline-radio', options: ['Default', 'Promo'] },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 372 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Card Badge" component set (node 9587:6233) in the SMAL Impact Design System file. Source of truth for variants: Figma. A strip along the top edge of a card, as wide as the card (372 in Figma), with rounded top corners and one centered line of text. `state` is Figma\'s `State`: Default is a neutral strip (surface/primary), Promo a green one (feedback/success). Figma sets the Promo text in the same colour as Default; here it is forced black, because white on the green is only about 2.5:1 in Night and SMAL. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CardBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma State=Default. */
export const Default: Story = {
  args: { state: 'Default', children: '6 Months FREE' },
};

/** Figma State=Promo. */
export const Promo: Story = {
  args: { state: 'Promo', children: '6 Months FREE' },
};
