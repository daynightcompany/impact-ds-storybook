import type { Meta, StoryObj } from '@storybook/react-vite';
import { DragSkeleton } from './DragSkeleton';

const meta = {
  title: 'Impact DS/Drag skeleton',
  component: DragSkeleton,
  tags: ['autodocs'],
  argTypes: {
    notification: { control: 'boolean' },
    children: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 327 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Drag Skeleton" component set (node 9587:6220) in the SMAL Impact Design System file. Source of truth for variants: Figma. The top edge of a sheet that is dragged: a 32 x 4 handle and, with `notification` (Figma `Notification`), a line of text under it. Figma draws it 327 wide and 71.5 high in both variants; here it fills the width of its container and keeps 71.5 as its minimum height. The component only draws the edge: the dragging belongs to the sheet it sits in. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof DragSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Notification=True. */
export const Default: Story = {
  args: { notification: true, children: 'Live Activity' },
};

/** Figma Notification=False. */
export const WithoutNotification: Story = {
  name: 'Without notification',
  args: { notification: false },
};
