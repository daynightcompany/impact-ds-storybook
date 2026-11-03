import type { Meta, StoryObj } from '@storybook/react-vite';
import { Loader } from './Loader';

const meta = {
  title: 'Impact DS/Loader',
  component: Loader,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['M', 'L'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Loader" component set (node 9587:6032) in the SMAL Impact Design System file. Source of truth for variants: Figma. Size M is 24px with a 2px ring, L is 48px with a 3px ring (borderStroke/m and /l). A third of the ring is drawn in interactive/idle/primary with round ends, over a track in border/tertiary. The Figma frames are still, so the turn (1s, linear) is added here; with reduced motion it slows to 3s. It is an indeterminate progress bar for assistive tech: set `aria-label` to say what is loading. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Medium: Story = {
  args: { size: 'M' },
};

export const Large: Story = {
  args: { size: 'L' },
};
