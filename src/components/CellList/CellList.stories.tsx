import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CellList } from './CellList';
import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Cell list',
  component: CellList,
  tags: ['autodocs'],
  argTypes: {
    subtitle: { control: 'text' },
    label: { control: 'text' },
    chevron: { control: 'boolean' },
    iconLeft: { control: 'boolean' },
    avatar: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { onClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "cell list" component set (node 9587:5774) in the SMAL Impact Design System file. Source of truth for variants: Figma. Subtitle and Avatar are variants (a `subtitle` adds a second line and makes the title semibold; `avatar` replaces the left icon with an avatar); Label, Chevron and Icon left are booleans (`label` is shown when you pass text, `chevron` and `iconLeft` default to true). The row is 48px tall (64px with a subtitle) on Desktop and fills its container (Figma draws it 924px wide). It is a button, or a link when you pass an `href`. Figma has no hover or pressed state for it. Put rows in a Cell group to get dividers. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CellList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Title' },
};

export const WithSubtitle: Story = {
  args: { children: 'Title', subtitle: 'Subtitle' },
};

export const WithLabel: Story = {
  args: { children: 'Title', label: 'Label' },
};

export const WithAvatar: Story = {
  args: { children: 'Title', avatar: true },
};

export const WithAvatarAndSubtitle: Story = {
  args: {
    children: 'Dmytro Nikolaienko',
    subtitle: 'Design Systems Lead',
    avatar: <Avatar type="Initials">DN</Avatar>,
  },
};

export const WithoutChevron: Story = {
  args: { children: 'Title', chevron: false },
};

export const WithoutIcon: Story = {
  args: { children: 'Title', iconLeft: false },
};

export const CustomIcon: Story = {
  args: { children: 'Account', icon: <Icon name="account" /> },
};

export const AsLink: Story = {
  args: { children: 'Open the documentation', href: 'https://storybook.js.org', onClick: undefined },
};

export const Disabled: Story = {
  args: { children: 'Title', disabled: true },
};

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
    <div style={{ display: 'grid', gap: 4, width: 420 }}>
      {[false, true].map((avatar) =>
        [false, true].map((subtitle) => (
          <div key={`${avatar}-${subtitle}`} style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#888' }}>
              Avatar {String(avatar)}, Subtitle {String(subtitle)}
            </span>
            <CellList avatar={avatar} subtitle={subtitle ? 'Subtitle' : undefined} label="Label" />
            <CellList avatar={avatar} subtitle={subtitle ? 'Subtitle' : undefined} chevron={false} />
          </div>
        )),
      )}
      <span style={{ fontSize: 12, color: '#888' }}>Icon left off</span>
      <CellList iconLeft={false} />
    </div>
  ),
};
