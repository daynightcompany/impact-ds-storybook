import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Impact DS/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    hierarchy: { control: 'select', options: ['Primary', 'Secondary', 'Tertiary'] },
    size: { control: 'select', options: ['L', 'XL'] },
    icon: { control: 'select', options: ['False', 'Leading', 'Trailing', 'Only'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Base/Button" component (node 9587:3078) in the SMAL Impact Design System file. Source of truth for variants: Figma. Sizes follow the Figma ladder: L is 56px tall (40px on Mobile), XL is 64px (56px on Mobile for text buttons). Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'False', children: 'Button' },
};

export const Secondary: Story = {
  args: { hierarchy: 'Secondary', size: 'L', icon: 'False', children: 'Button' },
};

export const Tertiary: Story = {
  args: { hierarchy: 'Tertiary', size: 'L', icon: 'False', children: 'Button' },
};

export const ExtraLarge: Story = {
  args: { hierarchy: 'Primary', size: 'XL', icon: 'False', children: 'Button' },
};

export const WithLeadingIcon: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'Leading', children: 'Button' },
};

export const WithTrailingIcon: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'Trailing', children: 'Button' },
};

export const IconOnly: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'Only' },
};

export const Disabled: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'False', children: 'Button', disabled: true },
};

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
      {(['L', 'XL'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 16 }}>
          <span style={{ fontSize: 12, color: '#888' }}>Size {size}</span>
          {(['Primary', 'Secondary', 'Tertiary'] as const).map((hierarchy) => (
            <div key={hierarchy} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ width: 90, fontSize: 12, color: '#888' }}>{hierarchy}</span>
              <Button hierarchy={hierarchy} size={size} icon="False">Button</Button>
              <Button hierarchy={hierarchy} size={size} icon="Leading">Button</Button>
              <Button hierarchy={hierarchy} size={size} icon="Trailing">Button</Button>
              <Button hierarchy={hierarchy} size={size} icon="Only" />
              <Button hierarchy={hierarchy} size={size} icon="False" disabled>Button</Button>
            </div>
          ))}
        </div>
      ))}
    </div>
  ),
};
