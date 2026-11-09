import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImagePreview } from './ImagePreview';

const meta = {
  title: 'Impact DS/Image preview',
  component: ImagePreview,
  tags: ['autodocs'],
  argTypes: {
    src: { control: 'text' },
    alt: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Image Preview" component (node 9587:7876) in the SMAL Impact Design System file. Source of truth for variants: Figma. The stand-in for a picture: a grey area with an image icon in the middle until a picture is given. It is as wide as the space it is in (924 in the Figma frame) and 345.6 high; the cards that hold it size it themselves. The icon is 96 x 72 on Desktop and 64 x 48 on Mobile, as in the Figma "Image" component; use the Breakpoint switch in the toolbar to see the Mobile one. Give it a `src` for a picture or `children` for anything else (a `picture` element, a video).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 924, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the placeholder. */
export const Default: Story = {};

/** Another height: a card sets `--image-preview-height`, or give the preview a `style` of your own. */
export const OtherHeight: Story = {
  name: 'Other height',
  render: (args) => <ImagePreview {...args} style={{ '--image-preview-height': '160px' } as CSSProperties} />,
};

/** Desktop and Mobile are both snapshotted: the icon is 96 x 72 on Desktop and 64 x 48 on Mobile. */
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
      <ImagePreview />
      <ImagePreview style={{ '--image-preview-height': '240px' } as CSSProperties} />
    </div>
  ),
};
