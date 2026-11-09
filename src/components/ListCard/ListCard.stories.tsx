import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListCard } from './ListCard';
import { CellList } from '../CellList/CellList';
import { Divider } from '../Divider/Divider';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/List card',
  component: ListCard,
  tags: ['autodocs'],
  args: { showTopContainer: false, showLabel: true, showTextBlock: true },
  argTypes: {
    label: { control: 'text' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Lists" component (node 9587:7814) in the SMAL Impact Design System file. Source of truth for variants: Figma. A list of `CellList` rows with a `Divider` between them, on a background/primary card with corner radius m, spacing/s of padding and the 5 px background blur of the glass-S effect. The `showTopContainer` boolean puts a label and a text block (title and subtitle) over the list; `showLabel` and `showTextBlock` show or hide each of them. Without `children` it shows three rows, as in Figma. It is as wide as the space it is in (400 in the Figma frame) and at least 160. The stories sit on a surface/primary area, as in the Figma frame. The padding, corner radius, row height and type follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar).',
      },
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ padding: 24, background: 'var(--theme-color-surface-primary)' }}>
        <div style={{ width: parameters.fullWidth ? 'auto' : 400, maxWidth: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ListCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: three rows, without the top container. */
export const Default: Story = {};

/** The `showTopContainer` boolean on: a label and a text block over the list. */
export const WithTopContainer: Story = {
  name: 'With top container',
  args: { showTopContainer: true },
};

/** Only the label in the top container (`showTextBlock` off). */
export const LabelOnly: Story = {
  name: 'Label only',
  args: { showTopContainer: true, showTextBlock: false },
};

/** Only the text block in the top container (`showLabel` off). */
export const TextBlockOnly: Story = {
  name: 'Text block only',
  args: { showTopContainer: true, showLabel: false },
};

export const RealTexts: Story = {
  name: 'Real texts',
  args: {
    showTopContainer: true,
    label: 'Account',
    title: 'Your account',
    subtitle: 'Your details, orders and invoices.',
    children: (
      <>
        <CellList icon={<Icon name="account" />}>Profile</CellList>
        <Divider aria-hidden="true" />
        <CellList icon={<Icon name="cart" />} label="2 new">
          Orders
        </CellList>
        <Divider aria-hidden="true" />
        <CellList icon={<Icon name="files" />}>Invoices</CellList>
      </>
    ),
  },
};

/** At its least width, 160. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 160 }}>
        <Story />
      </div>
    ),
  ],
};

/** With and without the top container; Desktop and Mobile are both snapshotted. */
export const AllVariants: Story = {
  parameters: {
    fullWidth: true,
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 400px))', alignItems: 'start', gap: 24 }}>
      <ListCard />
      <ListCard showTopContainer />
      <ListCard showTopContainer showLabel={false} />
      <ListCard showTopContainer showTextBlock={false} />
    </div>
  ),
};
