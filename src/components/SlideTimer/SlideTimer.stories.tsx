import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SlideTimer } from './SlideTimer';

const meta = {
  title: 'Impact DS/Slide timer',
  component: SlideTimer,
  tags: ['autodocs'],
  argTypes: {
    slide: { control: { type: 'number', min: 1, max: 8, step: 1 } },
    count: { control: { type: 'number', min: 1, max: 8, step: 1 } },
    duration: { control: { type: 'number', min: 500, step: 500 } },
    paused: { control: 'boolean' },
    showSlider: { control: 'boolean' },
  },
  args: { slide: 1, count: 4, duration: 5000, paused: true, showSlider: true, onSlideChange: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Slide timer" component set (node 9587:6174) in the SMAL Impact Design System file. Source of truth for variants: Figma. One bar per slide, and every bar is inactive (a 40 wide track in border/tertiary): only the progress is active. The current slide\'s bar is 75 wide and its fill grows over `duration` (the Progress animation). Figma draws the other slides\' bars solid, which made some bars look active and the current one inactive; here none of them is. When the slide changes the bars glide to their new widths and the fill that was running fades out where it stopped (ease out, 300ms, no motion with a reduced-motion preference). `Slide` 1 to 4 is `slide`, and `showSlider` is Figma\'s `Show Slider` (the two arrows, Tertiary icon buttons). The Figma frames show the start of a slide, so the stories here are `paused` on a fresh slide; the Demo story runs. It controls nothing itself: when its bar fills or an arrow is pressed it calls `onSlideChange` with the slide to show next (after the last comes the first), and the page passes that back as `slide`. Where the space is narrower than the row, the arrows go under the bars. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SlideTimer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Slide=1. */
export const Default: Story = {};

/** Figma Slide=2. */
export const SecondSlide: Story = {
  name: 'Second slide',
  args: { slide: 2 },
};

/** Figma Slide=3. */
export const ThirdSlide: Story = {
  name: 'Third slide',
  args: { slide: 3 },
};

/** Figma Slide=4. */
export const FourthSlide: Story = {
  name: 'Fourth slide',
  args: { slide: 4 },
};

/** Figma Show Slider off. */
export const WithoutSlider: Story = {
  name: 'Without slider',
  args: { showSlider: false },
};

/** Figma's "Demo": the bar fills, the next slide starts, the arrows step through. */
export const Demo: Story = {
  args: { duration: 3000, paused: false },
  parameters: { chromatic: { disableSnapshot: true } },
  render: function Render(args) {
    const [slide, setSlide] = useState(args.slide ?? 1);
    return (
      <SlideTimer
        {...args}
        slide={slide}
        onSlideChange={(next) => {
          setSlide(next);
          args.onSlideChange?.(next);
        }}
      />
    );
  },
};
