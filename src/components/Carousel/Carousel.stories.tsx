import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Carousel } from './Carousel';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { samplePhoto } from '../ImagePreview/samplePhotos';
import { ProductCard, type ProductCardSize } from '../ProductCard/ProductCard';

const NAMES = [
  'Podcaster Pro',
  'Studio Mic',
  'Boom Arm',
  'Pop Filter',
  'Shock Mount',
  'Audio Interface',
  'Monitor Headphones',
  'Desk Stand',
  'Cable Kit',
  'Field Recorder',
];

/** Product cards with pictures and names, the first `count` of them; links so that the keyboard can reach them. */
function products(count: number, size: ProductCardSize = 'S') {
  return NAMES.slice(0, count).map((name, index) => (
    <ProductCard
      key={name}
      size={size}
      productName={name}
      href={`#${name.toLowerCase().replace(/ /g, '-')}`}
      picture={<ImagePreview src={samplePhoto(index)} alt="" />}
    />
  ));
}

const meta = {
  title: 'Impact DS/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Carousel" component (node 9587:7714) in the SMAL Impact Design System file. Source of truth for variants: Figma. A row of items (the `children` slot; Figma shows seven small product cards) with two round Primary icon buttons under it on the right. Here the row scrolls: each button moves it by a page, with an item landing at the start, and is disabled when there is nowhere left to go (both are, when everything fits); touch, trackpad and the arrow keys scroll it too. The row is one region that can be focused, named with `label`. The spacing and the buttons follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). The stories sit in a 780 wide box, as the Figma frame is.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 780, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: seven small product cards, here in a 780 wide box so that they do not all fit. The first page is shown, so the button that goes back is disabled. */
export const Default: Story = {};

/** With pictures and names; each card is a link. */
export const WithPictures: Story = {
  name: 'With pictures',
  args: { label: 'Featured products', children: products(10) },
};

/** Medium cards. */
export const MediumCards: Story = {
  name: 'Medium cards',
  args: { label: 'Featured products', children: products(6, 'M') },
};

/** Everything fits: there is nothing to scroll and both buttons are disabled. */
export const FewItems: Story = {
  name: 'Few items',
  args: { label: 'Featured products', children: products(3) },
};

/** Pressing Next moves the row by a page, which enables Previous. */
export const OnTheNextPage: Story = {
  name: 'On the next page',
  args: { label: 'Featured products', children: products(10) },
  // The play function scrolls it: wait for the smooth scroll to end before the snapshot.
  parameters: { chromatic: { delay: 1200 } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Next' }));
  },
};

/** Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 48 }}>
      <Carousel />
      <Carousel label="Featured products">{products(10)}</Carousel>
      <Carousel label="New products">{products(3)}</Carousel>
    </div>
  ),
};
