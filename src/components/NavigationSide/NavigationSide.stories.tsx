import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavigationSide } from './NavigationSide';
import { SampleIcons, SideMenu } from '../NavigationTop/NavigationTop.samples';

const meta = {
  title: 'Impact DS/Navigation side',
  component: NavigationSide,
  tags: ['autodocs'],
  argTypes: {
    logo: { control: false },
    menu: { control: false },
    icons: { control: false },
  },
  args: {
    'aria-label': 'Main',
    menu: <SideMenu />,
    icons: <SampleIcons mobileButton />,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Converted from the Figma "Navigation/Side" component (node 9587:6569) in the SMAL Impact Design System file. Source of truth for variants: Figma. The column at the side of a page, on the surface colour: the logo and the menu at the top, the icons at the foot. The three slots are `logo` (the Impact DS logo by default, drawn 56 wide), `menu` (a vertical `TabList` of Secondary tabs, size L, with only the icon) and `icons` (icon buttons, an Avatar, in a column). The bar is as wide as its content (88, at least 72) and as tall as its container; the top group and the icons sit at the two ends, with spacing/xl at least between them. The samples are Figma\'s: nine tabs with the placeholder icon, three icon buttons and the Avatar. The menu is not shown on Mobile, and the samples hide the three icon buttons there too, and show one more button instead, as Figma does. It is a `nav` landmark, so give it an `aria-label`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof NavigationSide>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's side bar: logo, nine tabs and the icons. */
export const Default: Story = {};

/** The bar fills the height of its container: the icons sit at the foot. */
export const TallContainer: Story = {
  name: 'Tall container',
  args: { 'aria-label': 'Main, tall container' },
  decorators: [
    (Story) => (
      <div style={{ height: 1100 }}>
        <Story />
      </div>
    ),
  ],
};
