import type { Meta, StoryObj } from '@storybook/react-vite';
import { GalleryPreview, GalleryPreviewTile } from './GalleryPreview';

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
          'Converted from the Figma "Gallery preview" component set (node 9587:7965) in the SMAL Impact Design System file. Source of truth for variants: Figma, which has one variant of it, Type=Gallery with Paspartu=False. A wall of pictures of different sizes in one frame, as wide as the viewport (1920 on Desktop, 375 on Mobile; use the Breakpoint switch in the toolbar) and 1080 high on both, on a surface/primary background. The tiles (the `children`; Figma shows nine `ImagePreview` tiles) lie in rows that wrap, with rounded corners and spacing/s between them. On Desktop the rows are centered, so a wall that is higher than the frame is cut off equally at the top and the bottom. Figma has no Mobile layout for it: its tiles keep the Desktop sizes, which are all wider than the Mobile frame and would be cut off at both sides. Here nothing is cut off on Mobile: the frame grows with its content and the tiles fill its width, one under the other, with their proportions. A `GalleryPreviewTile` is an `ImagePreview` with the Desktop size of Figma (`width` and `height`) that does this; a tile of your own that is wider than the frame is cut off. The frame is as wide as the viewport variable, or as wide as the space it is in when that is narrower.',
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

/** Three of the Figma tiles, as `GalleryPreviewTile`s: the rows are centered in the frame. On Mobile they fill its width. */
export const FewTiles: Story = {
  name: 'Few tiles',
  args: {
    children: (
      <>
        <GalleryPreviewTile width={586} height={652} />
        <GalleryPreviewTile width={475} height={388} />
        <GalleryPreviewTile width={383} height={319} />
      </>
    ),
  },
};
