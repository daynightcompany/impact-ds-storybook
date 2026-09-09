import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Impact DS/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    hierarchy: { control: 'select', options: ['Primary', 'Secondary', 'Tertiary'] },
    size: { control: 'select', options: ['M', 'L'] },
    icon: { control: 'select', options: ['False', 'Leading', 'Trailing', 'Only'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Base/Button" component (node 2767:7590) in the SMAL Impact Design System file. Source of truth for variants: Figma.',
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { hierarchy: 'Primary', size: 'M', icon: 'False', children: 'Button' },
};

export const Secondary: Story = {
  args: { hierarchy: 'Secondary', size: 'M', icon: 'False', children: 'Button' },
};

export const Tertiary: Story = {
  args: { hierarchy: 'Tertiary', size: 'M', icon: 'False', children: 'Button' },
};

export const Large: Story = {
  args: { hierarchy: 'Primary', size: 'L', icon: 'False', children: 'Button' },
};

export const WithLeadingIcon: Story = {
  args: { hierarchy: 'Primary', size: 'M', icon: 'Leading', children: 'Button' },
};

export const WithTrailingIcon: Story = {
  args: { hierarchy: 'Primary', size: 'M', icon: 'Trailing', children: 'Button' },
};

export const IconOnly: Story = {
  args: { hierarchy: 'Primary', size: 'M', icon: 'Only' },
};

export const Disabled: Story = {
  args: { hierarchy: 'Primary', size: 'M', icon: 'False', children: 'Button', disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {(['Primary', 'Secondary', 'Tertiary'] as const).map((hierarchy) => (
        <div key={hierarchy} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 90, fontSize: 12, color: '#888' }}>{hierarchy}</span>
          <Button hierarchy={hierarchy} size="M" icon="False">Button</Button>
          <Button hierarchy={hierarchy} size="M" icon="Leading">Button</Button>
          <Button hierarchy={hierarchy} size="M" icon="Trailing">Button</Button>
          <Button hierarchy={hierarchy} size="M" icon="Only" />
          <Button hierarchy={hierarchy} size="M" icon="False" disabled>Button</Button>
        </div>
      ))}
    </div>
  ),
};
