import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProductCard } from './ProductCard';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { samplePhoto } from '../ImagePreview/samplePhotos';

const meta = {
  title: 'Impact DS/Product card',
  component: ProductCard,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['L', 'M', 'S'] },
    productName: { control: 'text' },
    href: { control: 'text' },
  },
  args: { size: 'L', labels: true, productName: 'Product Name' },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/ProductCard" component set (node 9587:7693) in the SMAL Impact Design System file. Source of truth for variants: Figma. A picture over the centered name of a product. Size is a variant: L is as wide as the space it is in (924 in the Figma frame) with a 345.6 high picture; M is 250 x 250 and S is 125 x 125, with the name wrapping under the picture. The `labels` boolean shows or hides the name. The corner radius, spacing and type follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). Without a `picture` it shows the grey placeholder; give it an `ImagePreview` with a `src`, or an `img`. With an `href` the whole card is one link.',
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div style={{ width: context.args.size === 'L' ? 924 : 'auto', maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Size L with the name. */
export const Default: Story = {};

export const Medium: Story = { args: { size: 'M' } };

export const Small: Story = { args: { size: 'S' } };

/** The `labels` boolean off: just the picture. */
export const WithoutLabels: Story = {
  name: 'Without labels',
  args: { size: 'M', labels: false },
};

/** A picture instead of the placeholder. */
export const WithPicture: Story = {
  name: 'With a picture',
  args: {
    size: 'M',
    productName: 'Podcaster Pro',
    picture: <ImagePreview src={samplePhoto(2)} alt="" />,
  },
};

/** The whole card is a link; the keyboard focus ring is drawn around it. */
export const AsLink: Story = {
  name: 'As a link',
  args: {
    size: 'M',
    productName: 'Podcaster Pro',
    href: '#podcaster-pro',
    picture: <ImagePreview src={samplePhoto(5)} alt="" />,
  },
};

/** A long name wraps under the picture. */
export const LongName: Story = {
  name: 'Long name',
  args: { size: 'S', productName: 'Wireless studio headphones with a very long name' },
};

/** All three sizes, with and without the name; Desktop and Mobile are both snapshotted. */
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
      <ProductCard size="L" />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
        <ProductCard size="M" />
        <ProductCard size="M" labels={false} picture={<ImagePreview src={samplePhoto(1)} alt="" />} />
        <ProductCard size="S" />
        <ProductCard size="S" labels={false} />
      </div>
    </div>
  ),
};
