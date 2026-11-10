import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SlidePreviewCard } from './SlidePreviewCard';
import { SlideTimer } from '../SlideTimer/SlideTimer';

/** Figma's Slide timer draws four slides. */
const SLIDES = 4;

/** How long a card stays Active in the timer demo, in milliseconds. */
const SHOW_TIME = 3000;

/** The cards of the slides: the one at `slide` (counted from 1) is Active, the others go to their slide when they are pressed. */
function Cards({ slide, onSlide }: { slide: number; onSlide: (slide: number) => void }) {
  return (
    <div style={{ display: 'grid', gap: 8, width: 272, maxWidth: '100%' }}>
      {Array.from({ length: SLIDES }, (_, index) => {
        const active = slide === index + 1;
        return (
          <SlidePreviewCard
            key={index}
            state={active ? 'Active' : 'Inactive'}
            onClick={active ? undefined : () => onSlide(index + 1)}
          />
        );
      })}
    </div>
  );
}

/** The Figma title, repeated until it takes more than two lines. */
const LONG_TITLE = 'Preview card title Preview card title Preview card title Preview card title';

const meta = {
  title: 'Impact DS/Slide preview card',
  component: SlidePreviewCard,
  tags: ['autodocs'],
  args: { state: 'Active', children: 'Preview card title', onClick: fn() },
  argTypes: {
    state: { control: 'inline-radio', options: ['Active', 'Inactive'] },
    children: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Slide preview" component set (node 9587:7677) in the SMAL Impact Design System file. Source of truth for variants: Figma. The title of a slide on a rounded card, 272 wide. State is a variant: Active (the slide that is shown) has a border/tertiary fill: it is marked with `aria-current`, is out of the tab order, and does nothing when it is pressed; Inactive has no fill and goes to its slide when it is pressed. The card is a button in both states, so it stays the same element when the state changes, and the fill eases in and out over 300ms. A title of more than two lines is cut off. The spacing, corner radius and type follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). The Manual demo and Timer demo stories switch between the cards, the second one with a `SlideTimer`.',
      },
    },
  },
} satisfies Meta<typeof SlidePreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the Active card. */
export const Active: Story = {};

export const Inactive: Story = { args: { state: 'Inactive' } };

/** Two lines fit the row, more are cut off. */
export const LongTitle: Story = {
  name: 'Long title',
  args: { children: LONG_TITLE },
};

/** A list of previews: one is Active, the others go to their slide when they are pressed. */
export const InAList: Story = {
  name: 'In a list',
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 272 }}>
      <SlidePreviewCard state="Inactive" />
      <SlidePreviewCard state="Active" />
      <SlidePreviewCard state="Inactive" />
    </div>
  ),
};

/** Both states; Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 24, width: 272 }}>
      <SlidePreviewCard state="Active" />
      <SlidePreviewCard state="Inactive" />
      <SlidePreviewCard state="Active">{LONG_TITLE}</SlidePreviewCard>
    </div>
  ),
};

/** Press an Inactive card to go to its slide: it becomes the Active one, and the card that was Active goes back to Inactive. The fill eases in and out. */
export const ManualDemo: Story = {
  name: 'Manual demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return <Cards slide={slide} onSlide={setSlide} />;
  },
};

/** A Slide timer under the cards: its bar fills over three seconds, and then the next card is Active (after the last one comes the first). Pressing a card goes to it, and the bar starts again. */
export const TimerDemo: Story = {
  name: 'Timer demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return (
      <div style={{ display: 'grid', justifyItems: 'start', gap: 'var(--breakpoint-spacing-m)' }}>
        <Cards slide={slide} onSlide={setSlide} />
        <SlideTimer slide={slide} count={SLIDES} duration={SHOW_TIME} showSlider={false} onSlideChange={setSlide} />
      </div>
    );
  },
};
