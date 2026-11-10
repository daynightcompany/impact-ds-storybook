import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CalendarHeader } from './CalendarHeader';

const meta = {
  title: 'Impact DS/Calendar header',
  component: CalendarHeader,
  tags: ['autodocs'],
  args: { onPrevious: fn(), onNext: fn(), onMonthClick: fn(), onYearClick: fn() },
  argTypes: {
    singleSelect: { control: 'boolean' },
    arrows: { control: 'inline-radio', options: ['Left', 'Right', 'Both sides'] },
    month: { control: 'text' },
    year: { control: 'text' },
    previousLabel: { control: 'text' },
    nextLabel: { control: 'text' },
    monthExpanded: { control: 'boolean' },
    yearExpanded: { control: 'boolean' },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Calendar header" component set (node 9587:7016) in the SMAL Impact Design System file: the bar above a calendar grid with the previous and next arrows and the month and year. The Figma properties are `singleSelect` (Single select: the month and the year as two chips with a chevron, or the month alone as a title) and `arrows` (Left, Right or Both sides). The arrows are the Button component (L, Tertiary, icon only) and the chips are the Chip component (M, icon trailing) set in the XL label text. The component only draws and reports: change the month in `onPrevious` and `onNext`, and open your list of months or years in `onMonthClick` and `onYearClick` (the Date picker swaps the grid). With one arrow the opposite side keeps spacing/xl of room, as in Figma, so the three variants are about as wide; the header never gets narrower than its content. Source of truth for variants: Figma. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CalendarHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Single select=True, Arrows=Both sides". */
export const Default: Story = {};

/** Figma "Single select=True, Arrows=Left". */
export const ArrowLeft: Story = {
  args: { arrows: 'Left' },
};

/** Figma "Single select=True, Arrows=Right". */
export const ArrowRight: Story = {
  args: { arrows: 'Right' },
};

/** Figma "Single select=False": the month alone, as a title between the arrows. */
export const TitleOnly: Story = {
  args: { singleSelect: false },
  decorators: [
    (Story) => (
      <div style={{ width: 304, maxWidth: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

/** The six Figma variants on one canvas. */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 372px), max-content))', gap: 24 }}>
      <CalendarHeader arrows="Left" previousLabel="Previous month, single select, left" />
      <CalendarHeader arrows="Right" nextLabel="Next month, single select, right" />
      <CalendarHeader arrows="Both sides" previousLabel="Previous month, single select" nextLabel="Next month, single select" />
      <div style={{ width: 304, maxWidth: '100%' }}>
        <CalendarHeader singleSelect={false} arrows="Left" previousLabel="Previous month, title, left" />
      </div>
      <div style={{ width: 304, maxWidth: '100%' }}>
        <CalendarHeader singleSelect={false} arrows="Right" nextLabel="Next month, title, right" />
      </div>
      <div style={{ width: 304, maxWidth: '100%' }}>
        <CalendarHeader singleSelect={false} arrows="Both sides" previousLabel="Previous month, title" nextLabel="Next month, title" />
      </div>
    </div>
  ),
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The arrows page through the months; the chips are yours to wire to a list of months or years. */
export const Interactive: Story = {
  render: function Render(args) {
    const [index, setIndex] = useState(2026 * 12);
    return (
      <CalendarHeader
        {...args}
        month={MONTHS[index % 12]}
        year={Math.floor(index / 12)}
        onPrevious={() => setIndex(index - 1)}
        onNext={() => setIndex(index + 1)}
      />
    );
  },
  parameters: { chromatic: { disableSnapshot: true } },
};
