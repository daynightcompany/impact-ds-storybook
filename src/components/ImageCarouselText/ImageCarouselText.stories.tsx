import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImageCarouselText } from './ImageCarouselText';

const meta = {
  title: 'Impact DS/Image carousel text',
  component: ImageCarouselText,
  tags: ['autodocs'],
  args: { state: 'Active' },
  argTypes: {
    state: { control: 'inline-radio', options: ['Active', 'Inactive'] },
    children: { control: 'text' },
    subtitle: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Image carousel text" component set (node 9587:8004) in the SMAL Impact Design System file. Source of truth for variants: Figma. A title and a line of text under it, with a thin line at the left, for one picture of an image carousel. Figma\'s one variant property is `State`: Active is in the paragraph colour, Inactive is in the secondary paragraph colour at half strength. The item is as wide as the space it is in; the stories sit in a 435 wide box, as the Figma component page does, and the image carousel uses it 327 wide. The type follows the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar). The Active item is marked with `aria-current`.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 435, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ImageCarouselText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: State=Active. */
export const Active: Story = {};

/** Figma State=Inactive. */
export const Inactive: Story = { args: { state: 'Inactive' } };

/** Without the line under the title. */
export const WithoutSubtitle: Story = {
  name: 'Without subtitle',
  args: { subtitle: false },
};

/** Both states; Desktop and Mobile are both snapshotted. */
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
    <div style={{ display: 'grid', gap: 32 }}>
      <ImageCarouselText state="Active" />
      <ImageCarouselText state="Inactive" />
    </div>
  ),
};
