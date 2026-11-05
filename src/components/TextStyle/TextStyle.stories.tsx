import type { Meta, StoryObj } from '@storybook/react-vite';
import { TextStyle } from './TextStyle';

const meta = {
  title: 'Impact DS/Text style',
  component: TextStyle,
  tags: ['autodocs'],
  argTypes: {
    hierarchy: { control: 'inline-radio', options: ['Primary', 'Secondary', 'Tertiary'] },
    title: { control: 'text' },
    children: { control: 'text' },
    disclaimer: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: 924 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Text/PrimaryTextStyle" component set (node 9587:7396) in the SMAL Impact Design System file. Source of truth for variants: Figma. A title, a body text and a small grey disclaimer in a column, left aligned; Hierarchy (Primary, Secondary, Tertiary) steps the type and the space between the parts down, and "Show disclaimer" is the `disclaimer` prop. It is as wide as the space it is in. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof TextStyle>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: Hierarchy=Primary, with the disclaimer. */
export const Default: Story = {};

export const Secondary: Story = {
  args: { hierarchy: 'Secondary' },
};

export const Tertiary: Story = {
  args: { hierarchy: 'Tertiary' },
};

export const WithoutDisclaimer: Story = {
  name: 'Without disclaimer',
  args: { disclaimer: false },
};

/** All three hierarchies. Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 96 }}>
      {(['Primary', 'Secondary', 'Tertiary'] as const).map((hierarchy) => (
        <TextStyle key={hierarchy} hierarchy={hierarchy} />
      ))}
    </div>
  ),
};
