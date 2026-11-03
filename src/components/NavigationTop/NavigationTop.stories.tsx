import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationTop } from './NavigationTop';
import { SampleIcons, TopMenu } from './NavigationTop.samples';

const meta = {
  title: 'Impact DS/Navigation top',
  component: NavigationTop,
  tags: ['autodocs'],
  argTypes: {
    logo: { control: false },
    menu: { control: false },
    icons: { control: false },
  },
  args: {
    'aria-label': 'Main',
    menu: <TopMenu />,
    icons: <SampleIcons />,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Converted from the Figma "Navigation/Top" component (node 9587:6543) in the SMAL Impact Design System file. Source of truth for variants: Figma. The bar across the top of a page, on the background colour: the logo and the menu at the start, the icons at the end. The three slots are `logo` (the Impact DS logo by default, drawn 96 wide), `menu` (a `TabList` of Secondary tabs, size L, which fills the space between the logo and the icons) and `icons` (icon buttons, an Avatar). The bar is as tall as its tallest part (80 with the 56 high tabs and buttons) and fills the width of the page. The samples are Figma\'s: nine tabs, three icon buttons with the placeholder icon and the Avatar. The menu never breaks the bar: the tabs that do not fit its width are hidden behind a "…" button, which opens a menu of them (a `TabList` passed as `menu` gets `overflow="menu"` unless it sets its own). The Avatar of the samples is a button, with hover, press and focus states. The menu is not shown on Mobile, and the samples hide the three icon buttons there too (the Avatar stays), as Figma does. It is a `nav` landmark, so give it an `aria-label`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof NavigationTop>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's top bar: logo, nine tabs and the icons. */
export const Default: Story = {};

/** Not drawn in Figma: a bar with only the logo and the icons. */
export const WithoutMenu: Story = {
  name: 'Without menu',
  args: { 'aria-label': 'Main, without menu', menu: undefined },
};

/** Not drawn in Figma: a narrow bar. The tabs that do not fit are behind the "…" button, and the icons stay in place. */
export const NarrowBar: Story = {
  name: 'Narrow bar',
  args: { 'aria-label': 'Main, narrow bar' },
  decorators: [
    (Story) => (
      <div style={{ width: 760, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
