import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ProfilePhoto } from './ProfilePhoto';
import { SAMPLE_PHOTO } from '../Avatar/samplePhoto';

const meta = {
  title: 'Impact DS/Profile photo',
  component: ProfilePhoto,
  tags: ['autodocs'],
  argTypes: {
    adjustment: { control: 'select', options: ['add', 'edit'] },
    pressed: { control: 'boolean' },
    type: { control: 'select', options: ['Icon', 'Initials', 'Image'] },
    size: { control: { type: 'number', min: 48, max: 200, step: 4 } },
  },
  args: { onClick: fn(), 'aria-label': 'Change profile photo' },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Profile Photo" component set (node 9587:3436) in the SMAL Impact Design System file: a 100px Avatar with a 24px round action badge at its bottom-right corner. Adjustment is `add` (a plus, for a missing photo) or `edit` (a pencil). The whole thing is one button; pressing it greys the photo like the Avatar\'s Pressed state and moves the badge to the hover colour. Use `pressed` to show that look statically.',
      },
    },
  },
} satisfies Meta<typeof ProfilePhoto>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { adjustment: 'add' },
};

export const Edit: Story = {
  args: { adjustment: 'edit' },
};

export const Pressed: Story = {
  args: { adjustment: 'add', pressed: true },
};

export const WithPhoto: Story = {
  args: { adjustment: 'edit', type: 'Image', src: SAMPLE_PHOTO, alt: '' },
};

export const WithInitials: Story = {
  args: { adjustment: 'edit', type: 'Initials', children: 'DN' },
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
    <div style={{ display: 'grid', gap: 24 }}>
      {(['add', 'edit'] as const).map((adjustment) => (
        <div key={adjustment} style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
          <span style={{ width: 70, fontSize: 12, color: '#888' }}>{adjustment}</span>
          <ProfilePhoto adjustment={adjustment} aria-label="Change profile photo" />
          <ProfilePhoto adjustment={adjustment} pressed aria-label="Change profile photo (pressed)" />
          <ProfilePhoto adjustment={adjustment} type="Image" src={SAMPLE_PHOTO} alt="" />
          <ProfilePhoto adjustment={adjustment} type="Initials" aria-label="Change profile photo">
            DN
          </ProfilePhoto>
        </div>
      ))}
    </div>
  ),
};
