import type { Meta, StoryObj } from '@storybook/react-vite';
import { CardRow } from './CardRow';
import { CardWithIcons } from '../CardWithIcons/CardWithIcons';

const meta = {
  title: 'Impact DS/Card row',
  component: CardRow,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Card row" component (node 9587:7766) in the SMAL Impact Design System file. Source of truth for variants: Figma. A band on surface/primary with spacing/6xl above and below and a centered row of cards at most 1284 wide, spacing/l apart (Figma shows three Card with icons without buttons: the `children` slot). The cards share the row equally, each at least 272 wide, and the ones that do not fit go on the next line; the row keeps spacing/m at its sides when the space is narrower than 1284. The spacing follows the breakpoint tokens, so Mobile is tighter (use the Breakpoint switch in the toolbar).',
      },
    },
  },
} satisfies Meta<typeof CardRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: three cards without buttons. */
export const Default: Story = {};

/** The cards of the Figma default have no buttons; here they keep theirs (`cta` on). */
export const WithButtons: Story = {
  name: 'With buttons',
  args: {
    children: [0, 1, 2].map((index) => <CardWithIcons key={index} />),
  },
};

/** At a narrow width the cards go one under the other. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 420, maxWidth: '100%' }}>
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
