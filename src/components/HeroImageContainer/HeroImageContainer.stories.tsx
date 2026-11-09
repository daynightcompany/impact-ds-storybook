import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeroImageContainer } from './HeroImageContainer';

const meta = {
  title: 'Impact DS/Hero image container',
  component: HeroImageContainer,
  tags: ['autodocs'],
  argTypes: {
    image: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "HeroImageContainer" component (node 9587:7867) in the SMAL Impact Design System file. Source of truth for variants: Figma. A column as wide as the space it is in, filled with border/primary, that holds one image the size of the viewport: 1920 x 1080 on Desktop and 375 x 812 on Mobile (the Figma viewport/width and viewport/height variables; use the Breakpoint switch in the toolbar). The image is centered and cropped at the sides when the space is narrower than it. The `image` slot (a Figma instance swap) takes your own picture, an Image preview or a video; without it the image is the Figma placeholder, an image icon in the middle, 96 x 72 on both as in the Figma component. The stories sit in a frame as wide as the viewport variable, so Mobile is 375 wide and Desktop is 1920 wide, or as wide as the canvas when that is narrower.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 'var(--breakpoint-viewport-width)', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof HeroImageContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the placeholder. Desktop and Mobile are both snapshotted. */
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

/** In a space narrower than the image (here 480) the image is cropped at the sides and stays centered. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
