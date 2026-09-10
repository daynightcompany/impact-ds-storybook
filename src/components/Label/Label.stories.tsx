import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta = {
  title: 'Impact DS/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['S', 'M'] },
    icon: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Base/Label" component (node 2801:25227). Note: despite the Figma name, this is a purple pill/tag — not a form-field HTML label.',
      },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Small: Story = {
  args: { size: 'S', icon: false, children: 'Label' },
};

export const Medium: Story = {
  args: { size: 'M', icon: false, children: 'Label' },
};

export const SmallWithIcon: Story = {
  args: { size: 'S', icon: true, children: 'Label' },
};

export const MediumWithIcon: Story = {
  args: { size: 'M', icon: true, children: 'Label' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ width: 60, fontSize: 12, color: '#888' }}>S</span>
        <Label size="S">Label</Label>
        <Label size="S" icon>Label</Label>
      </div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <span style={{ width: 60, fontSize: 12, color: '#888' }}>M</span>
        <Label size="M">Label</Label>
        <Label size="M" icon>Label</Label>
      </div>
    </div>
  ),
};
