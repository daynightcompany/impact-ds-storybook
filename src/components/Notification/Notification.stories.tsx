import type { Meta, StoryObj } from '@storybook/react-vite';
import { Notification, type NotificationCategory } from './Notification';

const CATEGORIES: NotificationCategory[] = ['dot alert', 'dot warning', 'dot success', 'counter', 'warning'];

const meta = {
  title: 'Impact DS/Notification',
  component: Notification,
  tags: ['autodocs'],
  argTypes: {
    category: { control: 'select', options: CATEGORIES },
    children: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Notification" component set (node 9587:6011) in the SMAL Impact Design System file. Source of truth for variants: Figma. Category is one of three dots (alert, warning, success), a counter or a warning sign. The dots are 12px with a ring in interactive/idle/tertiary that separates them from whatever they sit on; the counter and the warning sign are 24px, and a longer count stretches the counter into a pill. The dots carry no text, so give one an `aria-label` when it must be announced. Figma binds the "!" of the warning sign to font/interactive/idle/secondary, which is white on the yellow in Night and SMAL; the code uses forced black so it stays readable. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Counter: Story = {
  args: { category: 'counter', children: '1' },
};

export const Warning: Story = {
  args: { category: 'warning' },
};

export const DotAlert: Story = {
  name: 'Dot alert',
  args: { category: 'dot alert', 'aria-label': 'Needs attention' },
};

export const DotWarning: Story = {
  name: 'Dot warning',
  args: { category: 'dot warning', 'aria-label': 'Warning' },
};

export const DotSuccess: Story = {
  name: 'Dot success',
  args: { category: 'dot success', 'aria-label': 'Done' },
};

/** All five Figma categories next to each other. */
export const AllCategories: Story = {
  name: 'All categories',
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      {CATEGORIES.map((category) => (
        <Notification key={category} category={category} aria-label={category.startsWith('dot') ? category : undefined} />
      ))}
    </div>
  ),
};

/** A count past one digit stretches the counter into a pill. */
export const LongCount: Story = {
  name: 'Long count',
  args: { category: 'counter', children: '128' },
};
