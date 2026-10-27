import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Chip, type ChipIcon } from './Chip';

const ICONS: ChipIcon[] = ['False', 'Leading', 'Trailing', 'Only', 'Both', 'Trailing Close', 'Only 2'];

const meta = {
  title: 'Impact DS/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['M', 'XL'] },
    icon: { control: 'select', options: ICONS },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClick: fn(), onClose: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Chips" component set (node 9587:3985, built on "Base/Chip" 9587:3893) in the SMAL Impact Design System file. Source of truth for variants: Figma. M is 40px tall, XL is 64px (48px on Mobile); every icon layout of a size has the same height. Unselected is text only and fills on hover; Selected is a filled pill with a ring; Disabled is an outlined pill at 30% opacity whether selected or not. The close layouts (Both, Trailing Close, Only 2) render a separate close button, wired with `onClose`. The icon layouts Only and Only 2 have no label: pass an `aria-label`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'M', icon: 'False', children: 'Chip' },
};

export const Selected: Story = {
  args: { size: 'M', icon: 'False', selected: true, children: 'Chip' },
};

export const ExtraLarge: Story = {
  args: { size: 'XL', icon: 'False', children: 'Chip' },
};

export const WithLeadingIcon: Story = {
  args: { size: 'M', icon: 'Leading', children: 'Chip' },
};

export const WithTrailingIcon: Story = {
  args: { size: 'M', icon: 'Trailing', children: 'Chip' },
};

export const IconOnly: Story = {
  args: { size: 'M', icon: 'Only', 'aria-label': 'Filter' },
};

export const Removable: Story = {
  args: { size: 'M', icon: 'Trailing Close', selected: true, children: 'Chip', closeLabel: 'Remove Chip' },
};

export const LeadingIconAndClose: Story = {
  args: { size: 'M', icon: 'Both', selected: true, children: 'Chip', closeLabel: 'Remove Chip' },
};

export const Disabled: Story = {
  args: { size: 'M', icon: 'False', disabled: true, children: 'Chip' },
};

const STATES = [
  { label: 'Unselected', selected: false, disabled: false },
  { label: 'Selected', selected: true, disabled: false },
  { label: 'Disabled', selected: false, disabled: true },
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
    <div style={{ display: 'grid', gap: 32 }}>
      {(['M', 'XL'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Size {size}</span>
          {STATES.map(({ label, selected, disabled }) => (
            <div key={label} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
              <span style={{ width: 90, fontSize: 12, color: '#888' }}>{label}</span>
              {ICONS.map((icon) => (
                <Chip
                  key={icon}
                  size={size}
                  icon={icon}
                  selected={selected}
                  disabled={disabled}
                  aria-label={icon === 'Only' || icon === 'Only 2' ? 'Filter' : undefined}
                >
                  Chip
                </Chip>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
