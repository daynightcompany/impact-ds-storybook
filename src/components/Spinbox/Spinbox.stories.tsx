import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Spinbox } from './Spinbox';

const meta = {
  title: 'Impact DS/Spinbox',
  component: Spinbox,
  tags: ['autodocs'],
  argTypes: {
    defaultValue: { control: 'number' },
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    disabled: { control: 'boolean' },
  },
  args: { defaultValue: 1, min: 0, max: 99, onChange: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Spinbox" component (node 9587:5318): a 56px box with the number, a 1px divider and a pair of chevrons that add or take one `step`. It hugs its width (95px for one digit). The number is a text field with the `spinbutton` role: type it, press ArrowUp / ArrowDown (PageUp / PageDown move ten steps, Home / End go to `min` / `max`) or press the chevrons. The number is committed, and kept between `min` and `max`, when the field loses focus or Enter is pressed. Figma draws the number at half opacity like the placeholder of an empty Input field; here it is at full contrast. Figma has a single state, so Hover, Focus and Disabled follow the Input field. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Spinbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Spinbox". */
export const Default: Story = {};

export const WithoutLimits: Story = {
  args: { min: undefined, max: undefined, defaultValue: 0 },
};

export const BigSteps: Story = {
  args: { step: 5, min: 0, max: 100, defaultValue: 25 },
};

export const Decimals: Story = {
  args: { step: 0.5, min: 0, max: 10, defaultValue: 1.5 },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState(2);
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Spinbox {...args} value={value} onChange={setValue} />
        <span>
          {value} {value === 1 ? 'item' : 'items'}
        </span>
      </div>
    );
  },
};

/** The Figma component with Hover, Focus and Disabled, which Figma does not draw. */
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
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 24 }}>
      {(
        [
          { name: 'Idle', props: {} },
          { name: 'Hover', props: { 'data-state': 'hover' as const } },
          { name: 'Focused', props: { 'data-state': 'focus' as const } },
          { name: 'Disabled', props: { disabled: true } },
          { name: 'At the limits', props: { defaultValue: 99 } },
          { name: 'Four digits', props: { defaultValue: 1234, max: 9999 } },
        ] as const
      ).map(({ name, props }) => (
        <div key={name} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 11, color: '#888' }}>{name}</span>
          <Spinbox defaultValue={1} min={0} max={99} {...props} />
        </div>
      ))}
    </div>
  ),
};
