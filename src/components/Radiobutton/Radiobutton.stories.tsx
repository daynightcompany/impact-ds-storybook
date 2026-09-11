import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radiobutton } from './Radiobutton';

const meta = {
  title: 'Impact DS/Radiobutton',
  component: Radiobutton,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    name: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Radiobutton" component (node 3386:13813). Built on a real native input — group multiple Radiobuttons by giving them the same `name`.',
      },
    },
  },
} satisfies Meta<typeof Radiobutton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { children: 'Label', name: 'story-idle' },
};

export const Checked: Story = {
  args: { children: 'Label', name: 'story-checked', defaultChecked: true },
};

export const Disabled: Story = {
  args: { children: 'Label', name: 'story-disabled', disabled: true },
};

export const DisabledChecked: Story = {
  args: { children: 'Label', name: 'story-disabled-checked', disabled: true, defaultChecked: true },
};

export const Group: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Radiobutton name="story-group" defaultChecked>Option one</Radiobutton>
      <Radiobutton name="story-group">Option two</Radiobutton>
      <Radiobutton name="story-group">Option three</Radiobutton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Radiobutton name="v1">Label</Radiobutton>
      <Radiobutton name="v2" defaultChecked>Label</Radiobutton>
      <Radiobutton name="v3" disabled>Label</Radiobutton>
      <Radiobutton name="v4" disabled defaultChecked>Label</Radiobutton>
    </div>
  ),
};
