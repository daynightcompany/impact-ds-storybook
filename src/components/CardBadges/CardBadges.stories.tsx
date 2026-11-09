import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardBadges } from './CardBadges';
import { CellList } from '../CellList/CellList';
import { Divider } from '../Divider/Divider';
import { ListCard } from '../ListCard/ListCard';

const meta = {
  title: 'Impact DS/Card badges',
  component: CardBadges,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Badges" component (node 9587:7828) in the SMAL Impact Design System file. Source of truth for variants: Figma. A centered row of two `ListCard`s (without the top container), spacing/2xs apart, on the area behind them: a surface/primary band in these stories, as in the Figma frame. The cards share the row equally, each between 310 and 640 wide (so 1284 wide in two columns of 640 in the Figma frame, which is 1824 wide), and go one under the other when the row is too narrow for two. It is not the `CardBadge` strip, which is a single line of text along the top of a card. The spacing and the cards follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--theme-color-surface-primary)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CardBadges>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: two lists of three rows. */
export const Default: Story = {};

/** Cards with their own rows. */
export const RealRows: Story = {
  name: 'Real rows',
  args: {
    children: [
      <ListCard key="a">
        <CellList>Shipping</CellList>
        <Divider aria-hidden="true" />
        <CellList>Returns</CellList>
        <Divider aria-hidden="true" />
        <CellList>Warranty</CellList>
      </ListCard>,
      <ListCard key="b">
        <CellList>Contact us</CellList>
        <Divider aria-hidden="true" />
        <CellList>Store finder</CellList>
        <Divider aria-hidden="true" />
        <CellList>Careers</CellList>
      </ListCard>,
    ],
  },
};

/** At a narrow width the two lists go one under the other. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
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
};
