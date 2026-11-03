import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { NavigationPage } from './NavigationPage';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Navigation page',
  component: NavigationPage,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    showTitle: { control: 'boolean' },
    leftIcons: { control: 'boolean' },
    rightIcons: { control: 'boolean' },
    additionalIcons: { control: 'boolean' },
  },
  args: { onBack: fn(), onClose: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 375 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Navigation/Page" component (node 9587:6595) in the SMAL Impact Design System file. Source of truth for variants: Figma. The bar of a page on a small screen: left icons, a centred title and right icons with a close icon, on the background colour. Same booleans and slots as the Dialog header: Left icons, Title, Right icons and Additional icons (shown with Right icons, as in Figma). Pass a node to `leftIcons` / `additionalIcons` to replace the default back arrow / placeholder icon. Unlike the Dialog header, the icons are not Buttons but plain 24 icons; the back arrow, the close icon and the placeholder icon are real buttons, with a hit area a little larger than the icon. The title, the MD label style, is the `h1` of the page; it is centred while the left icons are shown and sits at the start when they are not. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof NavigationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: every boolean on. */
export const Default: Story = {};

export const WithoutAdditionalIcons: Story = {
  name: 'Without additional icons',
  args: { additionalIcons: false },
};

export const WithoutLeftIcons: Story = {
  name: 'Without left icons',
  args: { leftIcons: false },
};

export const WithoutTitle: Story = {
  name: 'Without title',
  args: { showTitle: false },
};

export const CustomIcons: Story = {
  name: 'Custom icons',
  args: {
    title: 'Filters',
    leftIcons: (
      <button type="button" aria-label="Back" style={{ all: 'unset', display: 'inline-flex', cursor: 'pointer' }}>
        <Icon name="chevron-left" size={24} />
      </button>
    ),
    additionalIcons: (
      <button type="button" aria-label="Search" style={{ all: 'unset', display: 'inline-flex', cursor: 'pointer' }}>
        <Icon name="search" size={24} />
      </button>
    ),
  },
};

export const LongTitle: Story = {
  name: 'Long title',
  args: {
    title: 'A title that is far too long to fit on one line of the bar',
    leftIcons: false,
    additionalIcons: false,
  },
};

const BOOLS = [true, false] as const;

export const AllVariants: Story = {
  name: 'All variants',
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 375 }}>
      {BOOLS.flatMap((left) =>
        BOOLS.flatMap((title) =>
          BOOLS.flatMap((right) =>
            BOOLS.map((additional) => (
              <div key={`${left}${title}${right}${additional}`} style={{ display: 'grid', gap: 2 }}>
                <span style={{ fontSize: 11, color: '#888' }}>
                  left {String(left)} · title {String(title)} · right {String(right)} · additional {String(additional)}
                </span>
                <NavigationPage
                  leftIcons={left}
                  showTitle={title}
                  rightIcons={right}
                  additionalIcons={additional}
                />
              </div>
            )),
          ),
        ),
      )}
    </div>
  ),
};
