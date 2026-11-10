import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextLink } from '../TextLink/TextLink';
import { TextLinkGroup } from './TextLinkGroup';

/** Figma's group holds nine links, each with the text "Link". */
const links = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => <TextLink key={n} href="#" />);

const meta = {
  title: 'Impact DS/Text link group',
  component: TextLinkGroup,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['Horizontal', 'Vertical'] },
    children: { control: false },
  },
  args: { orientation: 'Horizontal', 'aria-label': 'Links', children: links },
  decorators: [
    (Story) => (
      <div style={{ width: 924, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/Links group" component set (node 9587:6286) in the SMAL Impact Design System file. Source of truth for variants: Figma. A list of Text links in a slot (`children`). Horizontal (Figma `Potition`, sic, is `orientation` here) fills the width of its container and wraps onto more rows, spacing/m between the links; Vertical stacks them left aligned, spacing/s between. Figma draws nine L links. Renders a `ul`, with a list item around each child. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof TextLinkGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Potition=Horizontal. */
export const Horizontal: Story = {};

/** Figma Potition=Vertical. */
export const Vertical: Story = {
  args: { orientation: 'Vertical' },
};

/** The row wraps when its container is narrower than the links. */
export const Wrapping: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};
