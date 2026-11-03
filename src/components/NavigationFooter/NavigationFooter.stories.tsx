import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextLink } from '../TextLink/TextLink';
import { TextLinkGroup } from '../TextLinkGroup/TextLinkGroup';
import { NavigationFooter } from './NavigationFooter';

/** Figma's row of links: nine links of size L. */
const horizontalLinks = (
  <TextLinkGroup orientation="Horizontal" aria-label="Footer links">
    {Array.from({ length: 9 }, (_, index) => (
      <TextLink key={index} size="L" href="#">
        Link
      </TextLink>
    ))}
  </TextLinkGroup>
);

/** Figma's four columns: five links of size M in each. */
const verticalLinksInColumns = [1, 2, 3, 4].map((column) => (
  <TextLinkGroup key={column} orientation="Vertical" aria-label={`Footer links, column ${column}`}>
    {Array.from({ length: 5 }, (_, index) => (
      <TextLink key={index} size="M" href="#">
        Link
      </TextLink>
    ))}
  </TextLinkGroup>
));

const meta = {
  title: 'Impact DS/Navigation footer',
  component: NavigationFooter,
  tags: ['autodocs'],
  argTypes: {
    upperLogo: { control: 'boolean' },
    horizontalLinks: { control: false },
    verticalLinksInColumns: { control: false },
    madeInSmal: { control: 'boolean' },
    socialIcons: { control: 'boolean' },
    note: { control: 'text' },
  },
  args: {
    horizontalLinks,
    verticalLinksInColumns,
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Converted from the Figma "Navigation/Footer" component (node 9587:6637) in the SMAL Impact Design System file. Source of truth for variants: Figma. The footer of a page, on the surface colour. The top has the logo, a row of links and the link groups in columns; the bottom has the "made in SMAL" line, the social icons and, under a divider, the two small logos with a note at the end. Figma\'s five booleans are the props `upperLogo`, `horizontalLinks`, `verticalLinksInColumns`, `madeInSmal` and `socialIcons`. The two kinds of links take their content: pass `TextLinkGroup`s with `TextLink`s (size L in the row, size M in the columns, as in Figma); a footer without them hides that part. The columns share the width equally, at least 140 each, and wrap onto more rows when the footer is narrow. `upperLogo` and `socialIcons` also take a node of your own; the default social buttons are Figma\'s (Buttons, Tertiary, size L, icon only) and have no destination. The footer fills the width of the page, at least 375. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof NavigationFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: every boolean on. */
export const Default: Story = {};

/** Only the top: the logo and the links. */
export const LinksOnly: Story = {
  name: 'Links only',
  args: { madeInSmal: false, socialIcons: false },
};

/** Only the bottom: no logo and no links. */
export const WithoutLinks: Story = {
  name: 'Without links',
  args: { upperLogo: false, horizontalLinks: undefined, verticalLinksInColumns: undefined },
};
