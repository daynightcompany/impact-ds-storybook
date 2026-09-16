import type { Meta, StoryObj } from '@storybook/react-vite';
import { Label } from './Label';

const meta = {
  title: 'Impact DS/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['S', 'M'] },
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
          'Converted from the Figma "Base/Label" component (node 2801:25227). Note: this is a purple pill/tag, not a form-field HTML label. `tone` reflects the documented manual-override color options shown on the page — Figma itself only defines Size/Icon as real variants.',
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

export const Medium: Story = {
  args: { size: 'M', tone: 'purple', children: 'Label' },
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
