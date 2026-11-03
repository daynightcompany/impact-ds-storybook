import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '../Button/Button';
import { FloatingToolbar } from './FloatingToolbar';

/** Figma's four placeholder items: Tertiary, size L, icon only. */
const items = [1, 2, 3, 4].map((n) => (
  <Button key={n} hierarchy="Tertiary" size="L" icon="Only" aria-label={`Item ${n}`} />
));

const meta = {
  title: 'Impact DS/Floating toolbar',
  component: FloatingToolbar,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    close: { control: 'boolean' },
    closeLabel: { control: 'text' },
    children: { control: false },
  },
  args: { label: 'Label', close: true, onClose: fn(), children: items },
  decorators: [
    // Figma shows the toolbar on a surface/primary frame, so the shadow reads
    (Story) => (
      <div style={{ padding: 32, background: 'var(--theme-color-surface-primary)' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Floating toolbar" component set (node 9587:6245) in the SMAL Impact Design System file. Source of truth for variants: Figma. A pill of actions that floats above the page: a label (`label`, Figma `Label`), your items and, with `close` (Figma `Close`), an X button at the end, on the page background with the large shadow. Figma\'s `Menu items` is however many items you pass as `children`: it draws five buttons, four placeholders and the close button, and an `Items` slot for more. The items are normally Tertiary icon-only Buttons of size L. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof FloatingToolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Menu items=5, Label=True, Close on. */
export const Default: Story = {};

/** Figma Close off. */
export const WithoutClose: Story = {
  name: 'Without close',
  args: { close: false },
};
