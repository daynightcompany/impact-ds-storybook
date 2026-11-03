import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Impact DS/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  argTypes: {
    icon: { control: 'boolean' },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Tooltip" component set (node 9587:5993) in the SMAL Impact Design System file. Source of truth for variants: Figma. A dark bubble (interactive/idle/primary) with one line of text and, with `icon`, a copy icon after it. Figma defines only the bubble, so the position next to the trigger is up to the page: give the bubble an id and point the trigger at it with `aria-describedby`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { icon: true, children: 'One month FREE with promo code: VFMSURANCE' },
};

export const WithoutIcon: Story = {
  name: 'Without icon',
  args: { icon: false, children: 'One month FREE with promo code: VFMSURANCE' },
};

/** The bubble hugs its text and only wraps when its container is narrower. */
export const Wrapping: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
  args: { icon: true, children: 'One month FREE with promo code: VFMSURANCE' },
};
