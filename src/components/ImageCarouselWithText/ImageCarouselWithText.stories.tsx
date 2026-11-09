import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCarouselWithText } from './ImageCarouselWithText';
import { ImageCarouselText, ImageCarouselTextLayers } from '../ImageCarouselText/ImageCarouselText';
import { ImagePreview } from '../ImagePreview/ImagePreview';

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
          'Converted from the Figma "Image carousel with text/Left/Top" component (node 9587:7983) in the SMAL Impact Design System file. Source of truth for variants: Figma. A frame as big as the viewport, 1920 x 1080 on Desktop and 375 x 812 on Mobile (the Figma viewport/width and viewport/height variables; use the Breakpoint switch in the toolbar), with one slot in the middle of it. Figma fills the slot with a column of four `ImageCarouselText` items, the first one Active, and an `ImagePreview` beside it; the slot is a row that wraps, so on Mobile the picture goes below the items. Pass `children` to fill the slot with your own content. The frame is as wide as the viewport variable, or as wide as the space it is in when that is narrower.',
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

/** Your own content in the slot: here the third item is Active. The picture sets its own size, as it takes the width that is left beside the items. */
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
        <ImagePreview style={{ flex: '1 0 0', minWidth: 1, '--image-preview-height': '720px' } as CSSProperties} />
      </>
    ),
  },
};
