import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextLink } from './TextLink';

const meta = {
  title: 'Impact DS/Text link',
  component: TextLink,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'inline-radio', options: ['L', 'M', 'S'] },
    hover: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { href: '#', children: 'Link' },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/Links" component set (node 9587:6262) in the SMAL Impact Design System file. Source of truth for variants: Figma. A link in the label style of its `size` (L is Interactive-Label Text 2XL, M is MD, S is XS) with a line along the bottom of the text box (borderStroke/s). On hover (Figma `State`) the line goes: it retracts to the right and comes back from there when the pointer leaves, ease out over 300ms (no motion with a reduced-motion preference). Figma\'s hover variants draw the line thicker instead; this follows the request to take it away on hover. It is a real link (an `a` element), so give it an `href`. Figma names the three hover variants Size6, Size5 and Size4; they are the hover looks of L, M and S, set here with `hover`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Size=L, State=Idle. */
export const Default: Story = {};

/** Figma Size=L, State=Hover (named Size6): no line. Hover the idle links to see it leave and come back. */
export const Hover: Story = {
  args: { hover: true },
};

/** Figma Size=M, State=Idle. */
export const Medium: Story = {
  args: { size: 'M' },
};

/** Figma Size=M, State=Hover (named Size5). */
export const MediumHover: Story = {
  name: 'Medium hover',
  args: { size: 'M', hover: true },
};

/** Figma Size=S, State=Idle. */
export const Small: Story = {
  args: { size: 'S' },
};

/** Figma Size=S, State=Hover (named Size4). */
export const SmallHover: Story = {
  name: 'Small hover',
  args: { size: 'S', hover: true },
};
