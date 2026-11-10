import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Carousel } from './Carousel';
import { ArticleCard } from '../ArticleCard/ArticleCard';
import { CardWithIcons } from '../CardWithIcons/CardWithIcons';
import { ProductCard, type ProductCardSize } from '../ProductCard/ProductCard';
import { SalesCard } from '../SalesCard/SalesCard';
import { TextStyle, type TextStyleHierarchy } from '../TextStyle/TextStyle';

/** Desktop and Mobile are both snapshotted. */
const desktopAndMobile = {
  chromatic: {
    modes: {
      desktop: { breakpoint: 'desktop' },
      mobile: { breakpoint: 'mobile' },
    },
  },
};

/** `count` product cards of one size, with the texts and the placeholder of Figma; links, so that the keyboard can reach them. */
function products(count: number, size: ProductCardSize = 'S') {
  return Array.from({ length: count }, (_, index) => <ProductCard key={index} size={size} href="#product" />);
}

/**
 * The page frame of the Figma Playground ("Demo pages", the frames "Carousel 4"
 * and "Carousel 3"): as wide as the viewport (1920 on Desktop, 375 on Mobile),
 * with spacing/6xl above and spacing/m around the rest, a Text style over the
 * carousel with spacing/m between them. The frame clips what runs past it:
 * the cards run off the edge of the page (`--carousel-bleed` is the margin),
 * so that the next card peeks in.
 */
function PageSection({
  hierarchy,
  background,
  label,
  children,
}: {
  hierarchy: TextStyleHierarchy;
  background: 'surface' | 'background';
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--breakpoint-spacing-m)',
        width: 'var(--breakpoint-viewport-width)',
        maxWidth: '100%',
        padding: 'var(--breakpoint-spacing-6xl) var(--breakpoint-spacing-m) var(--breakpoint-spacing-m)',
        overflow: 'clip',
        background: `var(--theme-color-${background}-primary)`,
      }}
    >
      <TextStyle hierarchy={hierarchy} />
      <Carousel label={label} style={{ '--carousel-bleed': 'var(--breakpoint-spacing-m)' } as CSSProperties}>
        {children}
      </Carousel>
    </div>
  );
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
          'Converted from the Figma "Card/Carousel" component (node 9587:7714) in the SMAL Impact Design System file. Source of truth for variants: Figma. A row of items (the `children` slot; Figma shows seven small product cards) with two round Primary icon buttons under it on the right. Here the row scrolls: each button moves it by a page, with an item landing at the start, and is disabled when there is nowhere left to go (both are, when everything fits); touch, trackpad and the arrow keys scroll it too. The row is one region that can be focused, named with `label`. The spacing and the buttons follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). The first stories sit in a 780 wide box, as the Figma frame is. The Article cards, Sales cards and Cards with icons stories put the carousel in a page, as the Figma Playground does (Demo pages): a frame as wide as the viewport, 1920 on Desktop and 375 on Mobile (use the Breakpoint switch in the toolbar), with a Text style over the carousel. The cards run off the edge of the page, so that the next one peeks in, while the first card and the buttons keep to the margin: give the carousel the custom property `--carousel-bleed`, set to the margin of the page (spacing/m), and let the frame clip what runs past it.',
      },
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ width: parameters.fullWidth ? 'auto' : 780, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: seven small product cards, here in a 780 wide box so that they do not all fit. The first page is shown, so the button that goes back is disabled. */
export const Default: Story = {};

/** The row with Size M product cards (250 x 250). */
export const MediumCards: Story = {
  name: 'Medium cards',
  args: { children: products(6, 'M') },
};

/** Everything fits: there is nothing to scroll and both buttons are disabled. */
export const FewItems: Story = {
  name: 'Few items',
  args: { children: products(3) },
};

/** Pressing Next moves the row by a page, which enables Previous. */
export const OnTheNextPage: Story = {
  name: 'On the next page',
  args: { children: products(10) },
  // The play function scrolls it: wait for the smooth scroll to end before the snapshot.
  parameters: { chromatic: { delay: 1200 } },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: 'Next' }));
  },
};

/** Desktop and Mobile are both snapshotted. */
export const AllVariants: Story = {
  parameters: desktopAndMobile,
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 48 }}>
      <Carousel />
      <Carousel label="Carousel 2">{products(10)}</Carousel>
      <Carousel label="Carousel 3">{products(3)}</Carousel>
    </div>
  ),
};

/** Article cards (Image=Background, 324 wide and 520 high) in a page, as in the Figma frame "Carousel 4": on the surface/primary colour, under a Secondary Text style. The row runs off the right edge of the page, so that the next card peeks in. */
export const ArticleCards: Story = {
  name: 'Article cards',
  parameters: { layout: 'fullscreen', fullWidth: true, ...desktopAndMobile },
  render: () => (
    <PageSection hierarchy="Secondary" background="surface" label="Articles">
      {Array.from({ length: 7 }, (_, index) => (
        <ArticleCard key={index} image="Background" style={{ width: 324 }} />
      ))}
    </PageSection>
  ),
};

/** Sales cards (514 wide on Desktop, 324 on Mobile) in a page, as in the Figma frame "Carousel 3": on the background/primary colour, under a Primary Text style. */
export const SalesCards: Story = {
  name: 'Sales cards',
  parameters: { layout: 'fullscreen', fullWidth: true, ...desktopAndMobile },
  render: (_args, { globals }) => (
    <PageSection hierarchy="Primary" background="background" label="Sales">
      {Array.from({ length: 7 }, (_, index) => (
        <SalesCard key={index} style={{ width: globals.breakpoint === 'mobile' ? 324 : 514 }} />
      ))}
    </PageSection>
  ),
};

/** Cards with icons (426 wide on Desktop, 324 on Mobile) in a page, on the surface/primary colour, under a Secondary Text style. */
export const CardsWithIcons: Story = {
  name: 'Cards with icons',
  parameters: { layout: 'fullscreen', fullWidth: true, ...desktopAndMobile },
  render: (_args, { globals }) => (
    <PageSection hierarchy="Secondary" background="surface" label="Cards with icons">
      {Array.from({ length: 7 }, (_, index) => (
        <CardWithIcons key={index} style={{ width: globals.breakpoint === 'mobile' ? 324 : 426 }} />
      ))}
    </PageSection>
  ),
};
