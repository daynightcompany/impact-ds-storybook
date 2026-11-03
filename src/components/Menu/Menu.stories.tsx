import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Menu, MenuItem, MoreMenu } from './Menu';

const pages = [
  { label: 'Page 2', href: '#' },
  { label: 'Page 3', href: '#' },
  { label: 'Page 4', href: '#' },
];

const meta = {
  title: 'Impact DS/Menu',
  component: MoreMenu,
  subcomponents: { Menu, MenuItem },
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    label: { control: 'text' },
    size: { control: 'inline-radio', options: ['M', 'L', 'XL'] },
    placement: {
      control: 'select',
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end', 'right-start', 'right-end', 'left-start', 'left-end'],
    },
    className: { control: false },
    onOpenChange: { control: false },
  },
  args: { label: 'More pages', size: 'L', placement: 'bottom-start', items: pages },
  decorators: [
    (Story) => (
      <div style={{ minHeight: 360, padding: 8 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    // The snapshot waits for the menu to finish fading in.
    chromatic: { delay: 700 },
    docs: {
      description: {
        component:
          'The list that a "…" button opens, for the items that did not fit: the pages a Breadcrumb folds, the tabs that do not fit a navigation bar. Figma draws the "…" button (a Tertiary Button, icon only) but no list, so this is built from the Popover: a panel like the Figma Popup (background/primary, cornerRadius/m, Shadow M) around rows drawn like a Secondary Tab of size L, text only, filled on hover, the selected row filled with a ring. `MoreMenu` is the button together with its menu: pass the `items` (a `label`, and an `href` to make an item a link) and it opens them below the button, or beside it with `placement` "right-start". `Menu` and `MenuItem` are the parts, for a menu with another trigger: you hold `open` and the `anchorRef`. It follows the menu pattern: the button has `aria-haspopup` and `aria-expanded`, the list is a `menu` with items that are `menuitem`s (`menuitemradio` when an item has `selected`, as the hidden tabs of a navigation bar). Focus goes to the selected item, or the first, when it opens; Up and Down, Home and End move it, Escape closes the menu and gives the focus back to the button, Tab leaves it, and choosing an item closes it. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof MoreMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The "…" button, closed: a Tertiary Button of size L with the more glyph. */
export const Default: Story = {};

/** Opened: the items as links, the focus on the first. */
export const Open: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'More pages' }));
  },
};

/** The tabs of a navigation bar that do not fit: items with a `selected` state, one of them the selected tab. */
export const WithSelectedItem: Story = {
  name: 'With selected item',
  args: {
    items: [
      { label: 'Page 6', selected: false },
      { label: 'Page 7', selected: true },
      { label: 'Page 8', selected: false },
      { label: 'Page 9', selected: false },
    ],
  },
  play: Open.play,
};

/** A disabled item is dimmed (30%) and cannot be chosen. */
export const WithDisabledItem: Story = {
  name: 'With disabled item',
  args: {
    items: [
      { label: 'Page 2', href: '#' },
      { label: 'Page 3', href: '#', disabled: true },
      { label: 'Page 4', href: '#' },
    ],
  },
  play: Open.play,
};

/** Beside the button, for a button in a side bar: `placement` "right-start". */
export const BesideTheButton: Story = {
  name: 'Beside the button',
  args: { placement: 'right-start' },
  play: Open.play,
};
