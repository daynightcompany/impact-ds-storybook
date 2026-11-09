import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ArticleCard } from './ArticleCard';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { samplePhoto } from '../ImagePreview/samplePhotos';

/**
 * A sample picture for behind the text of a Background card. The text colour is a
 * token: Secondary is font/paragraph/tertiary (white in Day mode, black in Night
 * mode, grey in SMAL) and Primary the default text colour (dark in Day mode,
 * white in Night mode and SMAL), so the picture is dark where the text is light
 * and pale where it is dark.
 */
function pictureBehind(color: 'Secondary' | 'Primary', theme?: string) {
  const pale = (color === 'Secondary' && theme === 'Night') || (color === 'Primary' && theme !== 'Night' && theme !== 'SMAL');
  return <ImagePreview src={samplePhoto(color === 'Secondary' ? 1 : 4, pale ? 'pale' : 'dark')} alt="" />;
}

const meta = {
  title: 'Impact DS/Article card',
  component: ArticleCard,
  tags: ['autodocs'],
  args: {
    image: 'Top',
    background: 'Card',
    textAndButtonsColor: 'Secondary',
    ctaBlock: true,
    onPrimaryClick: fn(),
    onSecondaryClick: fn(),
  },
  argTypes: {
    image: { control: 'inline-radio', options: ['Top', 'Background'] },
    background: { control: 'inline-radio', options: ['Card', 'None'] },
    textAndButtonsColor: { control: 'inline-radio', options: ['Secondary', 'Primary'] },
    picture: { control: false },
    eyebrow: { control: 'text' },
    children: { control: 'text' },
    subtitle: { control: 'text' },
    primaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Articles" component set (node 9587:7779) in the SMAL Impact Design System file. Source of truth for variants: Figma. A picture, a text block (eyebrow, title, subtitle) and, with the `ctaBlock` boolean, two L buttons (Primary and Secondary). It has corner radius l and is as wide as the space it is in (363 in the Figma frame) and at least 272. Figma has four variants: `image="Top"` puts a 268 high picture over the text, on a background/primary card (`background="Card"`) or with no fill (`background="None"`); `image="Background"` puts the picture behind a 520 high card, with the text at the top and the buttons at the bottom, in the inverse text colour (`textAndButtonsColor="Secondary"`: font/paragraph/tertiary, white in Day mode, for a dark picture) or the default one (`Primary`, for a light picture); the buttons keep their own colours in both. Without a `picture` it shows the grey placeholder; give it an `ImagePreview` with a `src`, or an `img`. Figma has only the Left alignment. The stories sit on a surface/primary area, as in the Figma frame; the pictures behind the text follow the theme. The spacing, corner radius, type and button size follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar).',
      },
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div style={{ padding: 24, background: 'var(--theme-color-surface-primary)' }}>
        <div style={{ width: parameters.fullWidth ? 'auto' : 363, maxWidth: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the picture on top of the text, on a card. */
export const Default: Story = {};

/** `background="None"`: the text sits on the area behind the card, without a fill. */
export const NoFill: Story = {
  name: 'Top, no fill',
  args: { background: 'None' },
};

/** `image="Background"` with the inverse text colour (white in Day mode), for a dark picture. */
export const BackgroundSecondary: Story = {
  name: 'Background picture, Secondary text',
  args: { image: 'Background', textAndButtonsColor: 'Secondary' },
  render: (args, { globals }) => <ArticleCard {...args} picture={pictureBehind('Secondary', globals.theme)} />,
};

/** `image="Background"` with the default text colour, for a light picture. */
export const BackgroundPrimary: Story = {
  name: 'Background picture, Primary text',
  args: { image: 'Background', textAndButtonsColor: 'Primary' },
  render: (args, { globals }) => <ArticleCard {...args} picture={pictureBehind('Primary', globals.theme)} />,
};

/** The `ctaBlock` boolean off: no buttons. */
export const WithoutButtons: Story = {
  name: 'Without buttons',
  args: { ctaBlock: false },
};

/** A picture instead of the placeholder. */
export const WithPicture: Story = {
  name: 'With a picture',
  args: { picture: <ImagePreview src={samplePhoto(2)} alt="" /> },
};

export const RealTexts: Story = {
  name: 'Real texts',
  args: {
    picture: <ImagePreview src={samplePhoto(6)} alt="" />,
    eyebrow: 'Guide',
    children: 'How to plan a launch week',
    subtitle: 'Five steps from the first brief to the first sale.',
    primaryButton: 'Read',
    secondaryButton: 'Save',
  },
};

/** At its least width, 272, the buttons stack. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 272 }}>
        <Story />
      </div>
    ),
  ],
};

/** The four variants of Figma; Desktop and Mobile are both snapshotted. */
export const AllVariants: Story = {
  parameters: {
    fullWidth: true,
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: (_args, { globals }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(272px, 363px))', alignItems: 'start', gap: 24 }}>
      <ArticleCard picture={<ImagePreview src={samplePhoto(2)} alt="" />} />
      <ArticleCard background="None" picture={<ImagePreview src={samplePhoto(3)} alt="" />} />
      <ArticleCard image="Background" textAndButtonsColor="Secondary" picture={pictureBehind('Secondary', globals.theme)} />
      <ArticleCard image="Background" textAndButtonsColor="Primary" picture={pictureBehind('Primary', globals.theme)} />
    </div>
  ),
};
