import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Impact DS/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    defaultChecked: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Checkbox" component (node 3304:10132). Built on a real native input, so try tabbing to it and pressing Space — it works like a real checkbox, not just a picture of one.',
      },
    },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { children: 'Label' },
};

export const Checked: Story = {
  args: { children: 'Label', defaultChecked: true },
};

export const Disabled: Story = {
  args: { children: 'Label', disabled: true },
};

export const DisabledChecked: Story = {
  args: { children: 'Label', disabled: true, defaultChecked: true },
};

export const NoLabel: Story = {
  args: {},
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Checkbox>Label</Checkbox>
      <Checkbox defaultChecked>Label</Checkbox>
      <Checkbox disabled>Label</Checkbox>
      <Checkbox disabled defaultChecked>Label</Checkbox>
    </div>
  ),
};
