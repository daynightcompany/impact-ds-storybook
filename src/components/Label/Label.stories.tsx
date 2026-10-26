import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta = {
  title: 'Impact DS/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['S', 'L'] },
    icon: { control: 'boolean' },
    tone: {
      control: 'select',
      options: ['purple', 'gray', 'dark', 'warning', 'error', 'success', 'orange', 'salad', 'ochre', 'azure', 'pink', 'wine'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Base/Label" component (node 9587:4638) in the SMAL Impact Design System file. Note: this is a purple pill/tag, not a form-field HTML label. Sizes: S is 32px tall, L is 56px (40px on Mobile). Use the Breakpoint switch in the toolbar to see the Mobile values. `tone` reflects the documented manual-override color options shown on the page — Figma itself only defines Size/Icon as real variants.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { size: 'S', tone: 'purple', children: 'Label' },
};

export const WithIcon: Story = {
  args: { size: 'S', tone: 'purple', icon: true, children: 'Label' },
};

export const Large: Story = {
  args: { size: 'L', tone: 'purple', children: 'Label' },
};

export const LargeWithIcon: Story = {
  args: { size: 'L', tone: 'purple', icon: true, children: 'Label' },
};

export const AllSizes: Story = {
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
    <div style={{ display: 'grid', gap: 16 }}>
      {(['S', 'L'] as const).map((size) => (
        <div key={size} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ width: 60, fontSize: 12, color: '#888' }}>Size {size}</span>
          <Label size={size}>Label</Label>
          <Label size={size} icon>Label</Label>
        </div>
      ))}
    </div>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['purple', 'gray', 'dark', 'warning', 'error', 'success', 'orange', 'salad', 'ochre', 'azure', 'pink', 'wine'] as const).map((tone) => (
        <Label key={tone} tone={tone}>{tone}</Label>
      ))}
    </div>
  ),
};
