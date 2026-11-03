import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta = {
  title: 'Impact DS/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object' },
    maxItems: { control: 'number' },
    moreLabel: { control: 'text' },
  },
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Page 2', href: '#' },
      { label: 'Page 3', href: '#' },
      { label: 'Current page', href: '#' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Breadcrumb" component set (node 9587:6612) in the SMAL Impact Design System file. Source of truth for variants: Figma. The pages of the path, each a Tertiary Button of size L, with an arrow between them. The last item is the current page. Figma\'s variant `More than 4 items` is what the component shows by itself when there are more items than `maxItems` (4 by default): the first item, a "more" button and the last two items. Pressing "more" shows the items it folded (and moves focus to the first of them). Figma\'s items are Buttons; here they are links (`a`, with an `href`) that use the Button\'s own classes, so they look and behave like the Buttons; an item without an `href` is plain text. A `nav` landmark: give it an `aria-label` that tells it from other navigation if the page has more than one breadcrumb. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `More than 4 items=False`: four items. */
export const Default: Story = {};

/** Figma `More than 4 items=True`: five items, the two in the middle folded into the "more" button. */
export const MoreThan4Items: Story = {
  name: 'More than 4 items',
  args: {
    'aria-label': 'Breadcrumb, long path',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Page 2', href: '#' },
      { label: 'Page 3', href: '#' },
      { label: 'Page 4', href: '#' },
      { label: 'Current page', href: '#' },
    ],
  },
};

/** Not drawn in Figma: items without an `href` are plain text, here the current page. */
export const CurrentPageAsText: Story = {
  name: 'Current page as text',
  args: {
    'aria-label': 'Breadcrumb, current page as text',
    items: [
      { label: 'Home', href: '#' },
      { label: 'Page 2', href: '#' },
      { label: 'Current page' },
    ],
  },
};
