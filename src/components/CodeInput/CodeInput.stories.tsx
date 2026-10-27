import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CodeInput, type CodeInputProps } from './CodeInput';

const meta = {
  title: 'Impact DS/Code input',
  component: CodeInput,
  tags: ['autodocs'],
  argTypes: {
    length: { control: { type: 'number', min: 2, max: 10 } },
    type: { control: 'inline-radio', options: ['numeric', 'alphanumeric'] },
    placeholder: { control: 'text' },
    helperText: { control: 'boolean' },
    error: { control: 'boolean' },
    link: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onChange: fn(), onComplete: fn(), onLinkClick: fn() },
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
          'Converted from the Figma "Code input" (node 9587:5359) and its "Base/Input Field" set (node 9587:5028): a verification code with one 56px box per character, sharing the width, with the helper text and link of the Base field below. Booleans: Link and Helper text are props. Idle, Hover, Focused and Disabled are the browser\'s own states, `error` sets Error, Empty and Populated follow the boxes. Typing fills the boxes in order and moves on; Backspace in an empty box goes back and deletes; arrow keys, Home and End move between boxes; a paste or a one-time-code autofill fills on from the box you are in. Figma\'s Code input frame has 8px between the boxes and its Base set 12px (spacing/xs); the Base set is followed. The AllVariants story shows Hover and Focused on the first box with `data-state`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CodeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Code input" / Idle / Empty. */
export const Default: Story = {};

export const PartlyFilled: Story = {
  args: { defaultValue: '123' },
};

/** Figma Idle / Populated. */
export const Complete: Story = {
  args: { defaultValue: '111111' },
};

export const WithHelperText: Story = {
  args: { helperText: true, link: true },
};

export const ErrorMessage: Story = {
  args: { error: 'That code is not right. Try again.', defaultValue: '111111', link: 'Send a new code' },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: '111' },
};

export const Alphanumeric: Story = {
  args: { type: 'alphanumeric', length: 4, placeholder: '·' },
};

export const FourDigits: Story = {
  args: { length: 4 },
};

/** Checks the code once the last box is filled. */
export const Controlled: Story = {
  render: function Render(args) {
    const [code, setCode] = useState('');
    const wrong = code.length === 6 && code !== '123456';
    return (
      <CodeInput
        {...args}
        value={code}
        onChange={setCode}
        error={wrong ? 'That code is not right. Try 123456.' : false}
        helperText={wrong ? undefined : 'We sent a code to your phone'}
      />
    );
  },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<CodeInputProps> };

const CASES: Case[] = [
  { name: 'Idle', props: {} },
  { name: 'Hover', state: 'hover', props: {} },
  { name: 'Focused', state: 'focus', props: {} },
  { name: 'Error', props: { error: true, helperText: true } },
  { name: 'Disabled', props: { disabled: true } },
];

/** The Figma variant set: State (Idle, Hover, Focused, Error, Disabled) x Condition (Empty, Populated). */
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 327px)', gap: 24, alignItems: 'start' }}>
            <CodeInput helperText link data-state={state} {...props} />
            <CodeInput
              helperText
              link
              defaultValue={state === 'hover' || state === 'focus' ? '1' : '111111'}
              data-state={state}
              {...props}
            />
          </div>
        </div>
      ))}
    </div>
  ),
};
