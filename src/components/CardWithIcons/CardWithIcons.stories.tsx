import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CardWithIcons } from './CardWithIcons';

const meta = {
  title: 'Impact DS/Card with icons',
  component: CardWithIcons,
  tags: ['autodocs'],
  args: { cta: true, onPrimaryClick: fn(), onSecondaryClick: fn() },
  argTypes: {
    eyebrow: { control: 'text' },
    children: { control: 'text' },
    subtitle: { control: 'text' },
    primaryButton: { control: 'text' },
    secondaryButton: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Card with icons" component (node 9587:7746) in the SMAL Impact Design System file. Source of truth for variants: Figma. An 84 x 84 icon over a text block (eyebrow, title, subtitle) and, with the `cta` boolean, two XL buttons (Primary and Secondary), on a background/primary card with corner radius l. It is as wide as the space it is in (426 in the Figma frame) and at least 272. The buttons stand under the text when the card is narrow and beside it when there is room, and stack when they do not fit side by side. The stories sit on a surface/primary area, as in the Figma frame. Figma has only the Left alignment and the Default state. The padding, corner radius, type and button size follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, background: 'var(--theme-color-surface-primary)' }}>
        <div style={{ width: 426, maxWidth: '100%' }}>
          <Story />
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof CardWithIcons>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: with the buttons (`cta`). */
export const Default: Story = {};

/** The `cta` boolean off, as in the Card row. */
export const WithoutButtons: Story = {
  name: 'Without buttons',
  args: { cta: false },
};

/** At its least width, 272: the text and the buttons stack. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 272 }}>
        <Story />
      </div>
    ),
  ],
};

/** Wide enough for the text (200) and the buttons (176 each, so 364 stacked or beside each other): the buttons stand beside the text. */
export const Wide: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 720 }}>
        <Story />
      </div>
    ),
  ],
};

/** Desktop and Mobile are both snapshotted. */
export const AllVariants: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      <CardWithIcons />
      <CardWithIcons cta={false} />
    </div>
  ),
};
