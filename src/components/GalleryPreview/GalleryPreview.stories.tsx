import type { Meta, StoryObj } from '@storybook/react-vite';
import { GalleryPreview } from './GalleryPreview';
import { ImagePreview } from '../ImagePreview/ImagePreview';

const meta = {
  title: 'Impact DS/Gallery preview',
  component: GalleryPreview,
  tags: ['autodocs'],
  argTypes: {
    children: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Gallery preview" component set (node 9587:7965) in the SMAL Impact Design System file. Source of truth for variants: Figma, which has one variant of it, Type=Gallery with Paspartu=False. A wall of pictures of different sizes in one frame, as wide as the viewport (1920 on Desktop, 375 on Mobile; use the Breakpoint switch in the toolbar) and 1080 high on both, on a surface/primary background. The tiles (the `children`; Figma shows nine `ImagePreview` tiles) lie in rows that wrap, with rounded corners and spacing/s between them. The rows are centered, so a wall that is higher than the frame is cut off equally at the top and the bottom, and on Mobile every tile is wider than the frame and is cut off equally at both sides. The frame is as wide as the viewport variable, or as wide as the space it is in when that is narrower.',
      },
    },
  },
} satisfies Meta<typeof GalleryPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: nine tiles. Desktop and Mobile are both snapshotted. */
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

/** Three of the Figma tiles: the rows are centered in the frame. */
export const FewTiles: Story = {
  name: 'Few tiles',
  args: {
    children: (
      <>
        <ImagePreview style={{ width: 586, height: 652 }} />
        <ImagePreview style={{ width: 475, height: 388 }} />
        <ImagePreview style={{ width: 383, height: 319 }} />
      </>
    ),
  },
};
