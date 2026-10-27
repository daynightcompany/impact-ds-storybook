import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar, type AvatarType } from './Avatar';
import { SAMPLE_PHOTO } from './samplePhoto';

const TYPES: AvatarType[] = ['Icon', 'Initials', 'Image'];

const meta = {
  title: 'Impact DS/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: TYPES },
    size: { control: { type: 'number', min: 24, max: 160, step: 4 } },
    selected: { control: 'boolean' },
    pressed: { control: 'boolean' },
    src: { control: 'text' },
    alt: { control: 'text' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Avatar" component set (node 9587:3379) in the SMAL Impact Design System file. Source of truth for variants: Figma. Type is Icon, Initials or Image; Selected adds a 2px ring; Pressed greys the fill (a tint over a photo) and drops the outline. Figma has no hover state. Give the avatar an `onClick` to make it a button that shows the Pressed look while it is held down; use `pressed` to show that look statically. Figma draws it at 40px and the Profile photo scales it to 100px; the content keeps its 24px size at any `size`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { type: 'Icon', 'aria-label': 'Account' },
};

export const Initials: Story = {
  args: { type: 'Initials', children: 'DN', 'aria-label': 'Dmytro N.' },
};

export const Image: Story = {
  args: { type: 'Image', src: SAMPLE_PHOTO, alt: 'Profile photo' },
};

export const ImagePlaceholder: Story = {
  args: { type: 'Image', 'aria-label': 'No photo yet' },
};

export const Selected: Story = {
  args: { type: 'Initials', children: 'DN', selected: true, 'aria-label': 'Dmytro N.' },
};

export const Pressed: Story = {
  args: { type: 'Initials', children: 'DN', pressed: true, 'aria-label': 'Dmytro N.' },
};

export const Large: Story = {
  args: { type: 'Image', src: SAMPLE_PHOTO, alt: 'Profile photo', size: 100 },
};

export const AsButton: Story = {
  args: { type: 'Initials', children: 'DN', onClick: fn(), 'aria-label': 'Open account menu' },
};

const STATES = [
  { label: 'Default', selected: false, pressed: false },
  { label: 'Pressed', selected: false, pressed: true },
  { label: 'Selected', selected: true, pressed: false },
  { label: 'Selected + pressed', selected: true, pressed: true },
] as const;

export const AllVariants: Story = {
  parameters: {
    // Snapshot both breakpoint modes so a Mobile regression is caught too.
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {TYPES.map((type) => (
        <div key={type} style={{ display: 'grid', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#888' }}>{type}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            {STATES.map(({ label, selected, pressed }) => (
              <div key={label} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                <Avatar
                  type={type}
                  selected={selected}
                  pressed={pressed}
                  src={type === 'Image' ? SAMPLE_PHOTO : undefined}
                  alt=""
                >
                  {type === 'Initials' ? 'DN' : undefined}
                </Avatar>
                <span style={{ fontSize: 11, color: '#888' }}>{label}</span>
              </div>
            ))}
            {type === 'Image' && (
              <div style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                <Avatar type="Image" />
                <span style={{ fontSize: 11, color: '#888' }}>Placeholder</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  ),
};
