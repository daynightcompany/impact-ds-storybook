import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SlidePreviewCard } from './SlidePreviewCard';

const meta = {
  title: 'Impact DS/Slide preview card',
  component: SlidePreviewCard,
  tags: ['autodocs'],
  args: { state: 'Active', children: 'Preview card title', onClick: fn() },
  argTypes: {
    state: { control: 'inline-radio', options: ['Active', 'Inactive'] },
    children: { control: 'text' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Card/Slide preview" component set (node 9587:7677) in the SMAL Impact Design System file. Source of truth for variants: Figma. The title of a slide on a rounded card, 272 wide. State is a variant: Active (the slide that is shown) has a border/tertiary fill and is not interactive, it is marked with `aria-current`; Inactive has no fill and is a button that goes to its slide. A title of more than two lines is cut off. The spacing, corner radius and type follow the breakpoint tokens, so Mobile is smaller (use the Breakpoint switch in the toolbar).',
      },
    },
  },
} satisfies Meta<typeof SlidePreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma default: the Active card. */
export const Active: Story = {};

export const Inactive: Story = { args: { state: 'Inactive' } };

/** Two lines fit the row, more are cut off. */
export const LongTitle: Story = {
  name: 'Long title',
  args: { children: 'A preview title that is long enough to take more than two lines of the card, so the rest is cut off' },
};

/** A list of previews: one is Active, the others are buttons. */
export const InAList: Story = {
  name: 'In a list',
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 272 }}>
      <SlidePreviewCard state="Inactive">First slide</SlidePreviewCard>
      <SlidePreviewCard state="Active">Second slide</SlidePreviewCard>
      <SlidePreviewCard state="Inactive">Third slide</SlidePreviewCard>
    </div>
  ),
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
    <div style={{ display: 'grid', gap: 24, width: 272 }}>
      <SlidePreviewCard state="Active" />
      <SlidePreviewCard state="Inactive" />
      <SlidePreviewCard state="Active">A preview title that is long enough to take more than two lines of the card</SlidePreviewCard>
    </div>
  ),
};
