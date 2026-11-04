import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { TimePicker, type DateRange, type TimePickerProps } from './TimePicker';
import { formatISODate } from './dates';

// Fixed dates, so the stories look the same on every day. March 2027 starts on a
// Monday and has 31 days: four full weeks and three days, like the Figma grid.
const MARCH = new Date(2027, 2, 1);
const WHOLE_MONTH: DateRange = { start: new Date(2027, 2, 1), end: new Date(2027, 2, 31) };

const meta = {
  title: 'Impact DS/Time picker',
  component: TimePicker,
  tags: ['autodocs'],
  args: { month: MARCH, onSelect: fn(), onPreview: fn(), onNavigate: fn() },
  argTypes: {
    time: { control: 'inline-radio', options: ['Day', 'Month', 'Year'] },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    locale: { control: 'text' },
    month: { control: false },
    value: { control: false },
    range: { control: false },
    previewDate: { control: false },
  },
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Time picker" component set (node 9587:7046) in the SMAL Impact Design System file. Despite its name it picks no clock time: it is the grid of the Date picker, in the three values of the Figma property Time (`Day`, `Month`, `Year`) and the three states Default, Selected single and Selected multi. The cells are the Chip component (size M): a selected one is a dark pill and a range is joined by a band behind its days, one band per row, as in Figma. The Day grid is 7 cells wide, 50 each (40 on Mobile), under a row of weekdays; Month and Year are 3 cells wide, as wide as the Day grid. The component only draws and picks: `month` says what is on show and `onNavigate` asks for a neighbouring period when a key leaves it (the Date picker and the Calendar header do the paging). Source of truth for variants: Figma. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof TimePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "State=Default, Time=Day". */
export const Default: Story = {};

/** Figma "State=Selected single, Time=Day": one day, a dark pill. */
export const SelectedSingle: Story = {
  args: { value: new Date(2027, 2, 13) },
};

/**
 * Figma "State=Selected multi, Time=Day": a range from the first to the last day
 * of the month. The first and the last are dark pills, each week between them is
 * one band.
 */
export const SelectedMulti: Story = {
  args: { range: WHOLE_MONTH },
};

/** A range that starts and ends in the middle of a week: each band runs from its first to its last day. */
export const RangeAcrossWeeks: Story = {
  args: { range: { start: new Date(2027, 2, 10), end: new Date(2027, 2, 24) } },
};

/** Figma "State=Default, Time=Month". */
export const Months: Story = {
  args: { time: 'Month' },
};

/** Figma "State=Selected single, Time=Month". */
export const MonthSelectedSingle: Story = {
  args: { time: 'Month', value: new Date(2027, 5, 1) },
};

/** Figma "State=Selected multi, Time=Month": the months of a range are joined by a band, one per row. */
export const MonthSelectedMulti: Story = {
  args: { time: 'Month', range: { start: new Date(2027, 3, 1), end: new Date(2027, 8, 1) } },
};

/** Figma "State=Default, Time=Year": a page of 12 years. */
export const Years: Story = {
  args: { time: 'Year', month: new Date(2027, 0, 1) },
};

/** Figma "State=Selected single, Time=Year". */
export const YearSelectedSingle: Story = {
  args: { time: 'Year', month: new Date(2027, 0, 1), value: new Date(2027, 0, 1) },
};

/** Figma "State=Selected multi, Time=Year". */
export const YearSelectedMulti: Story = {
  args: { time: 'Year', month: new Date(2027, 0, 1), range: { start: new Date(2019, 0, 1), end: new Date(2024, 0, 1) } },
};

/** The week starts on Sunday and the names follow the locale. */
export const SundayFirst: Story = {
  args: { weekStartsOn: 0, locale: 'en-US', value: new Date(2027, 2, 14) },
};

const caption = {
  margin: '0 0 8px',
  fontFamily: 'var(--font-interactive-label-text-sm-sans-regular-family), sans-serif',
  fontSize: 'var(--font-interactive-label-text-sm-sans-regular-size)',
  lineHeight: 'var(--font-interactive-label-text-sm-sans-regular-line-height)',
  color: 'var(--theme-color-font-interactive-idle-secondary)',
} as const;

/** The nine Figma variants on one canvas: Time (rows) by State (columns). */
export const AllVariants: Story = {
  render: () => {
    const sets: { label: string; props: Partial<TimePickerProps> }[][] = [
      [
        { label: 'Day, default', props: {} },
        { label: 'Day, selected single', props: { value: new Date(2027, 2, 13) } },
        { label: 'Day, selected multi', props: { range: WHOLE_MONTH } },
      ],
      [
        { label: 'Month, default', props: { time: 'Month' } },
        { label: 'Month, selected single', props: { time: 'Month', value: new Date(2027, 5, 1) } },
        { label: 'Month, selected multi', props: { time: 'Month', range: { start: new Date(2027, 3, 1), end: new Date(2027, 8, 1) } } },
      ],
      [
        { label: 'Year, default', props: { time: 'Year' } },
        { label: 'Year, selected single', props: { time: 'Year', value: new Date(2027, 0, 1) } },
        { label: 'Year, selected multi', props: { time: 'Year', range: { start: new Date(2019, 0, 1), end: new Date(2024, 0, 1) } } },
      ],
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 374px), max-content))', gap: '32px 48px' }}>
        {sets.flat().map(({ label, props }) => (
          <div key={label}>
            <p style={caption}>{label}</p>
            <TimePicker month={MARCH} aria-label={label} {...props} />
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Pick a first and a last day: the band follows the pointer and the focus. The
 * arrow keys carry on into the next month (`onNavigate`); Page Up and Page Down
 * move by a month.
 */
export const Interactive: Story = {
  render: function Render(args) {
    const [month, setMonth] = useState(MARCH);
    const [range, setRange] = useState<DateRange>({ start: null, end: null });
    const [preview, setPreview] = useState<Date | null>(null);
    const pick = (date: Date) => {
      if (!range.start || range.end) setRange({ start: date, end: null });
      else if (date < range.start) setRange({ start: date, end: range.start });
      else setRange({ start: range.start, end: date });
    };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TimePicker
          {...args}
          month={month}
          range={range}
          previewDate={preview}
          onPreview={setPreview}
          onNavigate={setMonth}
          onSelect={pick}
        />
        <p style={caption} aria-live="polite">
          {range.start ? `${formatISODate(range.start)} to ${range.end ? formatISODate(range.end) : '…'}` : 'Pick the first day'}
        </p>
      </div>
    );
  },
  parameters: { chromatic: { disableSnapshot: true } },
};
