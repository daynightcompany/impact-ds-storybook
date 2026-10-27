import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputField, type InputFieldProps } from './InputField';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Input field',
  component: InputField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    icon: { control: 'boolean' },
    chevron: { control: 'boolean' },
    required: { control: 'boolean' },
    helperText: { control: 'boolean' },
    error: { control: 'boolean' },
    link: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Label', onLinkClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 327 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Base/Input Field" component set (node 9587:4908) and its "Input field" wrapper (node 9587:5220). The label is the placeholder while the field is empty and a small caption above the value once there is one. Booleans: Icon, Chevron, Required, Link and Helper text are props (the "Left content" boolean only groups Required and the chevron). Idle, Hover, Focused and Disabled are the browser\'s own states; `error` sets the Error state; Empty and Populated follow the value. In the Figma wrapper sets every boolean is off, which is the default here; the "Every boolean" story is the Base set. Pass a node to `icon`, `helperText`, `error` or `link` instead of `true` to fill the slot. The AllVariants story shows Hover and Focused by putting `data-state` on a wrapper. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Input field" / Idle / Empty: every boolean off. */
export const Default: Story = {};

/** Populated: the label moves above the value. */
export const Populated: Story = {
  args: { defaultValue: 'Input' },
};

export const WithIcon: Story = {
  args: { icon: true },
};

export const CustomIcon: Story = {
  args: { icon: <Icon name="account" />, label: 'Name' },
};

export const Required: Story = {
  args: { required: true },
};

export const WithChevron: Story = {
  args: { chevron: true },
};

export const WithHelperText: Story = {
  args: { helperText: true },
};

export const WithLink: Story = {
  args: { link: true },
};

/** `error` with a message of your own replaces the helper text. */
export const ErrorMessage: Story = {
  args: { error: 'Enter a valid email address', defaultValue: 'name@' },
};

/** `error` alone keeps the helper text; with `helperText` on it reads "Error message", as in Figma. */
export const ErrorWithHelperText: Story = {
  args: { error: true, helperText: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** Figma "Base/Input Field" with every boolean on. */
export const EveryBoolean: Story = {
  args: { icon: true, chevron: true, required: true, helperText: true, link: true },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <InputField {...args} value={value} onChange={(event) => setValue(event.target.value)} helperText={`${value.length} characters`} />
      </div>
    );
  },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<InputFieldProps> };

const CASES: Case[] = [
  { name: 'Idle', props: {} },
  { name: 'Hover', state: 'hover', props: {} },
  { name: 'Focused', state: 'focus', props: {} },
  { name: 'Error', props: { error: true, helperText: true } },
  { name: 'Disabled', props: { disabled: true } },
];

const Sheet = ({ title, extra }: { title: string; extra: Partial<InputFieldProps> }) => (
  <section style={{ display: 'grid', gap: 12 }}>
    <h3 style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#888' }}>{title}</h3>
    {CASES.map(({ name, state, props }) => (
      <div key={name} style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontSize: 11, color: '#888' }}>{name}</span>
        <div data-state={state} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 327px)', gap: 24, alignItems: 'start' }}>
          <InputField label="Label" {...extra} {...props} />
          <InputField label="Label" defaultValue="Input" {...extra} {...props} />
        </div>
      </div>
    ))}
  </section>
);

/** The Figma variant sets: State (Idle, Hover, Focused, Error, Disabled) x Condition (Empty, Populated). */
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
    <div style={{ display: 'grid', gap: 32 }}>
      <Sheet title="Input field: every boolean off" extra={{}} />
      <Sheet
        title="Base/Input Field: every boolean on"
        extra={{ icon: true, chevron: true, required: true, helperText: true, link: true }}
      />
    </div>
  ),
};
