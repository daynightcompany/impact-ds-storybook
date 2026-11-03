import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Accordion } from './Accordion';

const bodyText =
  'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.';
const quote = 'Lorem ipsum may be used as a placeholder before the final copy is available.';

/** Figma's image placeholder: 807 high with a 96 x 72 icon on Desktop, 325.5 high with a 64 x 48 icon on Mobile. */
const placeholderCss = `
.accordion-story-media { display: grid; place-items: center; height: 807px; background: var(--theme-color-border-primary); color: var(--theme-color-surface-primary); }
.accordion-story-media svg { width: 96px; height: 72px; fill: currentColor; }
[data-breakpoint='375-mobile'] .accordion-story-media { height: 325.5px; }
[data-breakpoint='375-mobile'] .accordion-story-media svg { width: 64px; height: 48px; }
`;

function MediaPlaceholder() {
  return (
    <>
      <style>{placeholderCss}</style>
      <div className="accordion-story-media" role="img" aria-label="Image placeholder">
        <svg viewBox="0 0 96 72" aria-hidden>
          <path d="M24.7186 20.4094C30.4332 20.4094 35.0659 15.8406 35.0659 10.2047C35.0659 4.5688 30.4332 0 24.7186 0C19.0039 0 14.3713 4.5688 14.3713 10.2047C14.3713 15.8406 19.0039 20.4094 24.7186 20.4094Z" />
          <path d="M96 72H0L25.006 28.9134L35.7654 45.8913L56.6922 9.6378L96 72Z" />
        </svg>
      </div>
    </>
  );
}

const meta = {
  title: 'Impact DS/Accordion',
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    expanded: { control: 'boolean' },
    defaultExpanded: { control: false },
    bodyText: { control: 'text' },
    quote: { control: 'text' },
    media: { control: false },
    headingLevel: { control: 'inline-radio', options: [2, 3, 4, 5, 6] },
    onExpandedChange: { control: false },
  },
  args: {
    title: 'Placeholder Title',
    expanded: false,
    bodyText,
    quote,
    media: <MediaPlaceholder />,
    headingLevel: 3,
    onExpandedChange: fn(),
  },
  // The Controls panel sets the state the accordion starts in (a new value starts it over); clicking the header works as usual.
  render: ({ expanded, ...args }) => <Accordion key={String(expanded)} defaultExpanded={expanded} {...args} />,
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Accordion" component set (node 9587:6333) in the SMAL Impact Design System file. Source of truth for variants: Figma. A header with a plus (a minus when open) that opens a panel. Figma\'s variants are `Expanded` (False is a pill with only the headline; True is a card with a smaller radius, the body text, the quote and an image) and the booleans `Body text` and `Quote`, which are on when you pass `bodyText` and `quote`. The image is the `media` slot: pass an image or a video and it gets the full width and the rounded corners (the grey block here is Figma\'s placeholder). The accordion fills the width of its container, the text column is at most 1080 wide, and it opens and closes over 300ms. Let it keep its own state (`defaultExpanded`), or control it with `expanded` and listen to `onExpandedChange`. The header is a button inside a heading (`headingLevel`), the panel a labelled region. Inside a Secondary `AccordionList` it draws the list\'s "Features" version instead. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Expanded=False. */
export const Collapsed: Story = {};

/** Figma Expanded=True, Body text and Quote on. */
export const Expanded: Story = {
  args: { expanded: true },
};

/** Figma Expanded=True, Quote off. */
export const WithoutQuote: Story = {
  name: 'Without quote',
  args: { expanded: true, quote: undefined },
};

/** Figma Expanded=True, Body text off. */
export const WithoutBodyText: Story = {
  name: 'Without body text',
  args: { expanded: true, bodyText: undefined },
};

/** Not a Figma variant: the panel without the image. */
export const WithoutMedia: Story = {
  name: 'Without media',
  args: { expanded: true, media: undefined },
};
