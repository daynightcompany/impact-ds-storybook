import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { DatePicker, type DateRange } from './DatePicker';

// Fixed dates, so the stories look the same on every day. March 2027 starts on a
// Monday and has 31 days, like the Figma grid; "today" is the day this was made.
const TODAY = new Date(2026, 10, 4);
const MARCH = new Date(2027, 2, 1);
const WHOLE_MARCH: DateRange = { start: new Date(2027, 2, 1), end: new Date(2027, 2, 31) };

const meta = {
  title: 'Impact DS/Date picker',
  component: DatePicker,
  tags: ['autodocs'],
  args: {
    today: TODAY,
    onChange: fn(),
    onApply: fn(),
    onCancel: fn(),
    onClose: fn(),
    onCustom: fn(),
    onMonthChange: fn(),
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['Custom', 'Presets'] },
    header: { control: 'boolean' },
    title: { control: 'text' },
    presets: { control: 'boolean' },
    textInputs: { control: 'boolean' },
    footer: { control: 'boolean' },
    weekStartsOn: { control: 'inline-radio', options: [0, 1] },
    locale: { control: 'text' },
    value: { control: false },
    defaultValue: { control: false },
    month: { control: false },
    defaultMonth: { control: false },
    today: { control: false },
    presetOptions: { control: false },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '0 0 32px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Converted from the Figma "Date picker" component set (node 9587:6978) in the SMAL Impact Design System file. Type `Custom` is the panel to pick a range of days: a header (title and close), the list of presets, two fields for the first and the last day, two months of days under Calendar headers, and a footer with Cancel and Apply; the Figma booleans Header, Presets, Text inputs and Footer are props. Type `Presets` is the list of pre-defined ranges alone. It is built from the Dialog header and footer, the Text input group, the Calendar header and the Time picker. Pick two days in either order (the band follows the pointer while the last day is open), use the arrow keys, Page Up and Page Down, or type `YYYY-MM-DD` in a field; the chips of a header open a list of months or years. A preset sets the range and "Custom" hands over to the fields. The picker keeps its own state unless `value` and `month` are given. Desktop and Mobile follow the breakpoint variables as in Figma: on Desktop the panel is as wide as the viewport up to 1024 and shows the presets and a second month; on Mobile it is the 375 wide sheet with a drag handle, one month, and the fields and buttons stacked. With less room than the 1024 of Figma (a docs page, a small window) the months share the width and their days narrow: both stay side by side, with the presets beside them, from 913 wide; under that the presets run in a row above the dates, and under 736 the months drop under each other. Source of truth for variants: Figma. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Type=Custom": a whole month chosen, Custom active in the list. */
export const Default: Story = {
  args: { defaultMonth: MARCH, defaultValue: WHOLE_MARCH },
};

/** A range over two months: the band runs on from the first month into the second. */
export const RangeAcrossMonths: Story = {
  args: { defaultMonth: MARCH, defaultValue: { start: new Date(2027, 2, 18), end: new Date(2027, 3, 9) } },
};

/** Nothing chosen yet: Apply waits for both days. */
export const Empty: Story = {
  args: { defaultMonth: MARCH },
};

/** A preset is active when the range is the one it stands for. */
export const PresetActive: Story = {
  args: { defaultValue: { start: TODAY, end: TODAY } },
};

/** Figma "Type=Presets": the list of pre-defined ranges alone. */
export const Presets: Story = {
  args: { type: 'Presets' },
};

export const WithoutPresets: Story = {
  args: { presets: false, defaultMonth: MARCH, defaultValue: WHOLE_MARCH },
};

export const WithoutTextInputs: Story = {
  args: { textInputs: false, defaultMonth: MARCH, defaultValue: WHOLE_MARCH },
};

/** Header and footer are off: the panel inside a layout that has its own. */
export const BareCalendars: Story = {
  args: { header: false, footer: false, presets: false, textInputs: false, defaultMonth: MARCH, defaultValue: WHOLE_MARCH, 'aria-label': 'Choose dates' },
};

/** The week starts on Sunday and the names follow the locale. */
export const SundayFirst: Story = {
  args: { weekStartsOn: 0, locale: 'en-US', defaultMonth: MARCH, defaultValue: WHOLE_MARCH },
};
