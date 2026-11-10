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
          'Converted from the Figma "HeroImageContainer" component (node 9587:7867) in the SMAL Impact Design System file. Source of truth for variants: Figma. A column as wide as the space it is in, filled with border/primary, that holds one image as wide as the column and as high as the Figma viewport/height variable (1080 on Desktop, 812 on Mobile; use the Breakpoint switch in the toolbar), but never higher than the window (100vh), so that the image is never taller than the screen. The `image` slot (a Figma instance swap) takes your own picture, an Image preview or a video; without it the image is the Figma placeholder, an image icon in the middle, 96 x 72 on both as in the Figma component. The stories sit in a frame as wide as the viewport variable, so Mobile is 375 wide and Desktop is 1920 wide, or as wide as the canvas when that is narrower.',
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

/** In a narrower space (here 480) the image is as wide as the space; its height does not change. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 480, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
