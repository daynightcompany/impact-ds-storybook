import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { Progress } from './Progress';

const meta = {
  title: 'Impact DS/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    duration: { control: { type: 'number', min: 0, step: 500 } },
    paused: { control: 'boolean' },
  },
  args: { onComplete: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 480 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Progress" (node 9587:6046) and "Progress animation" (node 9587:6068) component sets in the SMAL Impact Design System file. Source of truth for variants: Figma. A 4px bar (spacing/3xs) with round ends that fills the width of its container: the track is border/tertiary, the fill interactive/idle/primary. `value` is the percentage (Figma `%` 0, 25, 50, 75, 100) and a new value slides the fill in 300ms. Figma draws the 25% fill about 7% wide; the code uses the real percentage. With `duration` it is the animation set: the fill grows from the 5px start of Figma\'s `%=0` frame to 100% in a straight line over that many milliseconds, `paused` holds it where it is (at the 5px start, a frame of the Slide timer) and `onComplete` fires at the end. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { value: 50, 'aria-label': 'Upload' },
};

export const Empty: Story = {
  args: { value: 0, 'aria-label': 'Upload' },
};

export const Done: Story = {
  args: { value: 100, 'aria-label': 'Upload' },
};

/** Figma `%`: 25, 50, 75, 100 and the empty track. */
export const Steps: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[0, 25, 50, 75, 100].map((value) => (
        <Progress key={value} value={value} aria-label={`${value}%`} />
      ))}
    </div>
  ),
};

/** Figma "Progress animation": from the 5px start to 100% over `duration`. */
export const Animation: Story = {
  args: { duration: 5000, paused: false, 'aria-label': 'Next slide' },
  parameters: { chromatic: { disableSnapshot: true } },
  render: function Render(args) {
    const [run, setRun] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
        <div style={{ width: '100%' }}>
          <Progress key={run} {...args} />
        </div>
        <Button hierarchy="Secondary" size="M" onClick={() => setRun((n) => n + 1)}>
          Run again
        </Button>
      </div>
    );
  },
};
