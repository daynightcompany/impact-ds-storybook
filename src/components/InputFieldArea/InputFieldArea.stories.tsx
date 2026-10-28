import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { InputFieldArea, type InputFieldAreaProps } from './InputFieldArea';

const LOREM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

const meta = {
  title: 'Impact DS/Input field area',
  component: InputFieldArea,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    rows: { control: 'number' },
    maxRows: { control: 'number' },
    helperText: { control: 'boolean' },
    error: { control: 'boolean' },
    link: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { label: 'Label', helperText: true, onLinkClick: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 600 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Input field area" component set (node 9587:5270): the Base/Input Field box for several lines of text. The 56px box is one line; it grows with the text, 24px a line, with the label above the text and the helper text under the box. Idle, Hover, Focused and Disabled are the browser\'s own states; `error` sets Error; Empty and Populated follow the text, and the label glides between the placeholder and the caption when the first character arrives or the last one goes (300ms, ease out). `rows` sets the least number of lines and `maxRows` the most before it scrolls (Figma has no limit). Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof InputFieldArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Input field area" / Idle / Empty. */
export const Default: Story = {};

/** Populated: the label moves above the text and the box grows with it. */
export const Populated: Story = {
  args: { defaultValue: LOREM },
};

export const MinimumRows: Story = {
  args: { rows: 4 },
};

export const MaximumRows: Story = {
  args: { maxRows: 3, defaultValue: LOREM },
};

export const WithLink: Story = {
  args: { link: true },
};

export const ErrorMessage: Story = {
  args: { error: 'Write at least 20 characters', defaultValue: 'Too short' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Some text' },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    return (
      <InputFieldArea
        {...args}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        helperText={`${value.length} / 200`}
        error={value.length > 200}
      />
    );
  },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<InputFieldAreaProps> };

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
    <div style={{ display: 'grid', gap: 24, width: 600 }}>
      {CASES.flatMap(({ name, state, props }) =>
        [
          { condition: 'Empty', value: undefined },
          { condition: 'Populated', value: LOREM },
        ].map(({ condition, value }) => (
          <div key={`${name}${condition}`} data-state={state} style={{ display: 'grid', gap: 4 }}>
            <span style={{ fontSize: 11, color: '#888' }}>
              {name} · {condition}
            </span>
            <InputFieldArea label="Label" helperText defaultValue={value} {...props} />
          </div>
        )),
      )}
    </div>
  ),
};
