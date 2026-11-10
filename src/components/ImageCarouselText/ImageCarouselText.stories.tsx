import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ImageCarouselText, ImageCarouselTextLayers } from './ImageCarouselText';

/** Figma shows four items in the carousel. */
const ITEMS = 4;

/** How long an item stays Active in the timer demo, in milliseconds. */
const SHOW_TIME = 3000;

const meta = {
  title: 'Impact DS/Image carousel text',
  component: ImageCarouselText,
  tags: ['autodocs'],
  args: { state: 'Active' },
  argTypes: {
    state: { control: 'inline-radio', options: ['Active', 'Inactive'] },
    children: { control: 'text' },
    subtitle: { control: 'text' },
    duration: { control: 'number' },
    paused: { control: 'boolean' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Image carousel text" component set (node 9587:8004) in the SMAL Impact Design System file. Source of truth for variants: Figma. A title and a line of text under it, with a thin line at the left, for one picture of an image carousel. Figma\'s one variant property is `State`: Active is in the paragraph colour, Inactive is in the secondary paragraph colour at half strength. Inactive goes to its picture when it is pressed (give it `onClick`); Active does nothing when it is pressed and is out of the tab order. The item is a button in both states, so it stays the same element when the state changes, and the change eases over 300ms: the colour and strength of the text and of the line. The item is as wide as the space it is in; the stories sit in a 435 wide box, as the Figma component page does, and the image carousel uses it 327 wide. The type follows the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). The Active item is marked with `aria-current`. The Manual demo and Timer demo stories switch between the items. For an auto-advancing carousel, give the items a `duration` (in milliseconds): the line of the Active item is then the timer, filling from the top, in place of a Slide timer under the items, and `onProgressEnd` says when it is full, so that the next item can be made Active; `paused` holds it. Figma has the line whole, so this is not in Figma yet.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 435, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCarouselText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: State=Active. */
export const Active: Story = {};

/** Figma State=Inactive. */
export const Inactive: Story = { args: { state: 'Inactive', onClick: fn() } };

/** Without the line under the title. */
export const WithoutSubtitle: Story = {
  name: 'Without subtitle',
  args: { subtitle: false },
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
    <div style={{ display: 'grid', gap: 32 }}>
      <ImageCarouselText state="Active" />
      <ImageCarouselText state="Inactive" />
    </div>
  ),
};

/** Press an Inactive item to go to its picture: it becomes the Active one, and the one that was Active goes back to Inactive. The change eases. */
export const ManualDemo: Story = {
  name: 'Manual demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return (
      <ImageCarouselTextLayers>
        {Array.from({ length: ITEMS }, (_, index) => {
          const active = slide === index + 1;
          return (
            <ImageCarouselText
              key={index}
              state={active ? 'Active' : 'Inactive'}
              onClick={active ? undefined : () => setSlide(index + 1)}
            />
          );
        })}
      </ImageCarouselTextLayers>
    );
  },
};

/** The line of the Active item is the timer: it fills from the top over three seconds, and then the next item is Active (after the last one comes the first). Pressing an item goes to it, and its line starts to fill; the line that was running stays where it stopped and fades out. Figma has the line whole, so this is not in Figma yet. */
export const TimerDemo: Story = {
  name: 'Timer demo',
  parameters: { chromatic: { disableSnapshot: true }, docs: { source: { type: 'code' } } },
  render: function Render() {
    const [slide, setSlide] = useState(1);
    return (
      <ImageCarouselTextLayers>
        {Array.from({ length: ITEMS }, (_, index) => {
          const active = slide === index + 1;
          return (
            <ImageCarouselText
              key={index}
              state={active ? 'Active' : 'Inactive'}
              duration={SHOW_TIME}
              onProgressEnd={() => setSlide((current) => (current % ITEMS) + 1)}
              onClick={active ? undefined : () => setSlide(index + 1)}
            />
          );
        })}
      </ImageCarouselTextLayers>
    );
  },
};
