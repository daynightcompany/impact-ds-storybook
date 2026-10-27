import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Dropdown, type DropdownProps } from './Dropdown';

const meta = {
  title: 'Impact DS/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'boolean' },
    chevron: { control: 'boolean' },
    required: { control: 'boolean' },
    open: { control: 'boolean' },
    helperText: { control: 'boolean' },
    error: { control: 'boolean' },
    link: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Label', onClick: fn(), onLinkClick: fn() },
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
          'Converted from the Figma "Dropdown" component set (node 9587:5298): the Base/Input Field box with a chevron that opens a popup. It is a button, so pressing it calls `onClick` and `open` shows the Focused state while the popup is open. The label is the placeholder while nothing is selected and a small caption above the `value` afterwards (Empty and Populated follow the value). Booleans: Icon, Chevron (on), Required, Link and Helper text are props; `error` and `disabled` set Error and Disabled, Hover and Focused are the browser\'s own. The Figma Dropdown tints the small label font/interactive/hover/tertiary, the Input field uses font/interactive/idle/secondary. See the Popup stories for a dropdown that opens a popup. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Dropdown" / Idle / Empty. */
export const Default: Story = {};

/** Populated: the label moves above the selected value. */
export const Populated: Story = {
  args: { value: 'Input' },
};

export const WithIcon: Story = {
  args: { icon: true, value: 'Input' },
};

export const Required: Story = {
  args: { required: true },
};

/** `open` is the Focused state, for as long as the popup is open. */
export const Open: Story = {
  args: { open: true, value: 'Input' },
};

export const WithHelperText: Story = {
  args: { helperText: true, link: true },
};

export const ErrorState: Story = {
  args: { error: 'Choose an option', value: undefined },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'Input' },
};

/** Toggles `open` and the value itself, the way a popup would. */
export const Interactive: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<string | undefined>();
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        <Dropdown {...args} open={open} value={value} onClick={() => setOpen((o) => !o)} />
        <div style={{ display: 'flex', gap: 8 }}>
          {['Input', 'Another', 'Third'].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setValue(name);
                setOpen(false);
              }}
            >
              {name}
            </button>
          ))}
          <button type="button" onClick={() => setValue(undefined)}>
            Clear
          </button>
        </div>
      </div>
    );
  },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<DropdownProps> };

const CASES: Case[] = [
  { name: 'Idle', props: {} },
  { name: 'Hover', state: 'hover', props: {} },
  { name: 'Focused', state: 'focus', props: {} },
  { name: 'Error', props: { error: true, helperText: true } },
  { name: 'Disabled', props: { disabled: true } },
];

/** The Figma variant set: State (Idle, Hover, Focused) x Condition (Empty, Populated), plus Error and Disabled. */
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
    <div style={{ display: 'grid', gap: 12 }}>
      {CASES.map(({ name, state, props }) => (
        <div key={name} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 11, color: '#888' }}>{name}</span>
          <div data-state={state} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 327px)', gap: 24, alignItems: 'start' }}>
            <Dropdown label="Label" {...props} />
            <Dropdown label="Label" value="Input" {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};
