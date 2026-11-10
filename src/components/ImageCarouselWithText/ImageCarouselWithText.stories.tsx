import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCarouselWithText, ImageCarouselWithTextImage } from './ImageCarouselWithText';
import { ImageCarouselText, ImageCarouselTextLayers } from '../ImageCarouselText/ImageCarouselText';
import { SlideTimer } from '../SlideTimer/SlideTimer';

/** Figma shows four items in the carousel. */
const ITEMS = 4;

/** How long an item stays Active in the timer demo, in milliseconds. */
const SHOW_TIME = 3000;

/** The items of the carousel: the one at `slide` (counted from 1) is Active, the others are buttons that go to their picture. */
function Items({ slide, onSlide }: { slide: number; onSlide: (slide: number) => void }) {
  return (
    <>
      {Array.from({ length: ITEMS }, (_, index) => {
        const active = slide === index + 1;
        return (
          <ImageCarouselText
            key={index}
            state={active ? 'Active' : 'Inactive'}
            onClick={active ? undefined : () => onSlide(index + 1)}
          />
        );
      })}
    </>
  );
}

const meta = {
  title: 'Impact DS/Image carousel with text',
  component: ImageCarouselWithText,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Image carousel with text/Left/Top" component (node 9587:7983) in the SMAL Impact Design System file. Source of truth for variants: Figma. A frame as big as the viewport, 1920 x 1080 on Desktop and 375 x 812 on Mobile (the Figma viewport/width and viewport/height variables; use the Breakpoint switch in the toolbar), but not higher than the window (100vh), with one slot in the middle of it. Figma fills the slot with a column of four `ImageCarouselText` items, the first one Active, and a picture beside it (an `ImageCarouselWithTextImage`); the slot is a row that wraps, so on Mobile the picture goes below the items. The picture fills the width that is left beside the items and is 80% of the window high at the most (876 at the most, as in Figma); on Mobile it is 294 high. Pass `children` to fill the slot with your own content; the Manual demo and Timer demo stories switch between the items. The frame is as wide as the viewport variable, or as wide as the space it is in when that is narrower.',
      },
    },
  },
} satisfies Meta<typeof ImageCarouselWithText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: four text items, the first Active, and the picture beside them. Desktop and Mobile are both snapshotted. */
export const Default: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
};

/** Your own content in the slot: here the third item is Active. */
export const OwnContent: Story = {
  name: 'Own content',
  args: {
    children: (
      <>
        <ImageCarouselTextLayers>
          <ImageCarouselText state="Inactive" />
          <ImageCarouselText state="Inactive" />
          <ImageCarouselText state="Active" />
          <ImageCarouselText state="Inactive" />
        </ImageCarouselTextLayers>
        <ImageCarouselWithTextImage />
      </>
    ),
  },
};

/** Press an Inactive item to go to its picture: it becomes the Active one, and the one that was Active goes back to Inactive. */
export const ManualDemo: Story = {
  name: 'Manual demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return (
      <ImageCarouselWithText>
        <ImageCarouselTextLayers>
          <Items slide={slide} onSlide={setSlide} />
        </ImageCarouselTextLayers>
        <ImageCarouselWithTextImage />
      </ImageCarouselWithText>
    );
  },
};

/** A Slide timer under the items: its bar fills over three seconds, and then the next item is Active (after the last one comes the first). Pressing an item goes to it, and the bar starts again. */
export const TimerDemo: Story = {
  name: 'Timer demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return (
      <ImageCarouselWithText>
        <div style={{ display: 'grid', flex: 'none', gap: 'var(--breakpoint-spacing-xl)', width: 'min(327px, 100%)' }}>
          <ImageCarouselTextLayers>
            <Items slide={slide} onSlide={setSlide} />
          </ImageCarouselTextLayers>
          <SlideTimer slide={slide} count={ITEMS} duration={SHOW_TIME} showSlider={false} onSlideChange={setSlide} />
        </div>
        <ImageCarouselWithTextImage />
      </ImageCarouselWithText>
    );
  },
};
