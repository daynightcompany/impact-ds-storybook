import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { GallerySlider } from './GallerySlider';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { SlideTimer } from '../SlideTimer/SlideTimer';

/** Desktop and Mobile are both snapshotted. */
const desktopAndMobile = {
  chromatic: {
    modes: {
      desktop: { breakpoint: 'desktop' },
      mobile: { breakpoint: 'mobile' },
    },
  },
};

const meta = {
  title: 'Impact DS/Gallery slider',
  component: GallerySlider,
  tags: ['autodocs'],
  args: { onPageChange: fn() },
  argTypes: {
    image: { control: 'inline-radio', options: ['Background', 'Peeking'] },
    title: { control: 'text' },
    buttons: { control: 'boolean' },
    slideIndicator: { control: 'boolean' },
    nextImagePeeking: { control: 'boolean' },
    children: { control: false },
    page: { control: { type: 'number', min: 1, step: 1 } },
    defaultPage: { control: { type: 'number', min: 1, step: 1 } },
    label: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Gallery slider" component set (node 9587:7903) in the SMAL Impact Design System file. Source of truth for variants: Figma. A frame as big as the viewport, 1920 x 1080 on Desktop and 375 x 812 on Mobile (the Figma viewport/width and viewport/height variables; use the Breakpoint switch in the toolbar), but never higher than the window (100vh), with a gallery of pictures behind its content: the title at the top left, the Slide indicator at the bottom in the middle and, on Desktop only, two round buttons at the sides that go back and on. The Figma variant property `Image` says how the pictures sit: `Background` fills the whole frame with the current picture, with rounded corners; `Peeking` shows it as a large rounded card in the middle of the frame, on the background/primary colour, with the next picture peeking in at the right edge (and, once you have moved on, the one before at the left edge). On Mobile the Peeking card fills the whole frame, as in Figma, with no peek. The Figma booleans are `title`, `buttons`, `slideIndicator` and `nextImagePeeking`; `slideIndicator` also takes a node in place of the Slide indicator, such as a `SlideTimer` (see the Auto rotation story). The pictures are the `children`, one for each slide; without them Figma\'s six placeholders show. The buttons go round at the ends. Swiping or dragging sideways and the left and right arrow keys (when the gallery has focus) turn the page as well, which is how Mobile, which has no buttons, goes on. The frame is as wide as the viewport variable, or as wide as the space it is in when that is narrower.',
      },
    },
  },
} satisfies Meta<typeof GallerySlider>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Image=Background with the title, the buttons and the Slide indicator. Desktop and Mobile are both snapshotted. */
export const Default: Story = {
  parameters: desktopAndMobile,
};

/** Figma Image=Peeking: the current picture as a card in the middle of the frame, the next one peeking in at the right edge. */
export const Peeking: Story = {
  args: { image: 'Peeking' },
  parameters: desktopAndMobile,
};

/** Peeking on the second slide: the next picture peeks in at the right edge and the first one at the left edge. */
export const PeekingOnTheSecondSlide: Story = {
  name: 'Peeking on the second slide',
  args: { image: 'Peeking', defaultPage: 2 },
};

/** Figma Next image peeking=false: only the current picture shows. */
export const WithoutNextImagePeeking: Story = {
  name: 'Without next image peeking',
  args: { image: 'Peeking', nextImagePeeking: false },
};

/** Figma Title=false. */
export const WithoutTitle: Story = {
  name: 'Without title',
  args: { title: false },
};

/** Figma Buttons=false. */
export const WithoutButtons: Story = {
  name: 'Without buttons',
  args: { buttons: false },
};

/** Figma Slide indicator=false. */
export const WithoutSlideIndicator: Story = {
  name: 'Without slide indicator',
  args: { slideIndicator: false },
};

/** Both variants; Desktop and Mobile are both snapshotted. */
export const AllVariants: Story = {
  parameters: desktopAndMobile,
  render: () => (
    <div style={{ display: 'grid', gap: 48 }}>
      <GallerySlider image="Background" label="Gallery slider 1" />
      <GallerySlider image="Peeking" label="Gallery slider 2" />
    </div>
  ),
};

/** Six pictures, as in Figma. */
const SLIDES = 6;

/** How long a picture stays on show, in milliseconds. */
const SHOW_TIME = 3000;

/**
 * The gallery turns by itself: a Slide timer takes the place of the Slide indicator. Its bar fills over three seconds and then asks for the next picture, after the last one comes the first. The timer holds while the pointer is over the gallery or the keyboard focus is in it, so that nobody is rushed. The buttons, swipes and the arrow keys turn the page too, and the bar starts again for the new picture.
 */
export const AutoRotation: Story = {
  name: 'Auto rotation',
  args: { image: 'Peeking' },
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render({ onPageChange, ...args }) {
    const [page, setPage] = useState(1);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const turn = (next: number) => {
      setPage(next);
      onPageChange?.(next);
    };
    return (
      <GallerySlider
        {...args}
        page={page}
        onPageChange={turn}
        slideIndicator={
          <SlideTimer
            slide={page}
            count={SLIDES}
            duration={SHOW_TIME}
            paused={hovered || focused}
            showSlider={false}
            onSlideChange={turn}
          />
        }
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) => setFocused(event.target.matches(':focus-visible'))}
        onBlur={() => setFocused(false)}
      >
        {Array.from({ length: SLIDES }, (_, index) => (
          <ImagePreview key={index} />
        ))}
      </GallerySlider>
    );
  },
};
