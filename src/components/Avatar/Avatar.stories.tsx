import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Avatar, type AvatarType } from './Avatar';

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
    children: { control: 'text' },
  },
  // With an onClick the avatar is a button: hover it and press it to see the states.
  args: { onClick: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Avatar" component set (node 9587:3379) in the SMAL Impact Design System file. Source of truth for variants: Figma. Type is Icon, Initials or Image (the grey picture placeholder); Selected adds a 2px ring; Pressed greys the fill (a tint over the placeholder) and drops the outline. The Figma prototype goes to Pressed on hover as well as on press (ease out 300ms, the press itself ease in-out 50ms) and a click toggles Selected, so give the avatar an `onClick` to make it a button that does the same (the stories here have one, so try them); use `pressed` to show the look statically. Figma draws it at 40px and the Profile photo scales it to 100px; the content keeps its 24px size at any `size`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
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

export const ImagePlaceholder: Story = {
  name: 'Image placeholder',
  args: { type: 'Image', 'aria-label': 'No photo yet' },
};

/** Figma State=Pressed, which the prototype also shows on hover. */
export const Pressed: Story = {
  args: { type: 'Initials', children: 'DN', pressed: true, 'aria-label': 'Dmytro N.' },
};

export const Selected: Story = {
  args: { type: 'Initials', children: 'DN', selected: true, 'aria-label': 'Dmytro N.' },
};

export const Large: Story = {
  args: { type: 'Image', size: 100, 'aria-label': 'No photo yet' },
};

const PEOPLE = [
  { initials: 'DN', name: 'Dmytro N.' },
  { initials: 'AK', name: 'Andrii K.' },
  { initials: 'RT', name: 'Rain T.' },
  { initials: 'MS', name: 'Mari S.' },
];

/** Hover (the Pressed look), press and click: one avatar of the group is selected at a time. */
export const Selectable: Story = {
  name: 'Selectable avatars',
  render: function Render() {
    const [current, setCurrent] = useState('DN');
    return (
      <div role="group" aria-label="Choose an avatar" style={{ display: 'flex', gap: 16 }}>
        {PEOPLE.map(({ initials, name }) => (
          <Avatar
            key={initials}
            type="Initials"
            selected={current === initials}
            onClick={() => setCurrent(initials)}
            aria-label={name}
          >
            {initials}
          </Avatar>
        ))}
      </div>
    );
  },
};

const STATES = [
  { label: 'Default', selected: false, pressed: false },
  { label: 'Pressed', selected: false, pressed: true },
  { label: 'Selected', selected: true, pressed: false },
  { label: 'Selected + pressed', selected: true, pressed: true },
] as const;

/** Figma's Type x Selected x State. The avatars are live too: hover shows Pressed, as in the prototype. */
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
            {STATES.map((state) => (
              <div key={state.label} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
                <Avatar
                  type={type}
                  selected={state.selected}
                  pressed={state.pressed}
                  onClick={() => {}}
                  aria-label={`${type} avatar, ${state.label.toLowerCase()}`}
                >
                  {type === 'Initials' ? 'DN' : undefined}
                </Avatar>
                <span style={{ fontSize: 11, color: '#888' }}>{state.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
