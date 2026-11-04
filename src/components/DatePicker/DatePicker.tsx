import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import styles from './DatePicker.module.css';
import { Button } from '../Button/Button';
import { CalendarHeader } from '../CalendarHeader/CalendarHeader';
import { Chip } from '../Chip/Chip';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { DialogHeader } from '../DialogHeader/DialogHeader';
import { InputField } from '../InputField/InputField';
import { isShown, type Slot } from '../Popup/PopupParts';
import { TextInputGroup } from '../TextInputGroup/TextInputGroup';
import { TimePicker, type TimePickerTime } from '../TimePicker/TimePicker';
import {
  addDays,
  addMonths,
  dayKey,
  endOfMonth,
  endOfWeek,
  formatISODate,
  isSameDay,
  parseISODate,
  startOfDay,
  startOfMonth,
  startOfWeek,
  type DateRange,
  type Weekday,
} from '../TimePicker/dates';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type { DateRange, Weekday } from '../TimePicker/dates';

/** Figma "Type": the whole panel, or the list of pre-defined ranges alone. */
export type DatePickerType = 'Custom' | 'Presets';

/** A pre-defined range of the list. One without a `range` is "Custom": the dates are the person's own. */
export interface DatePreset {
  id: string;
  label: string;
  /** The first and the last day of the preset, worked out from today and the first day of the week. */
  range?: (today: Date, weekStartsOn: Weekday) => DateRange;
}

/** The options of Figma's list: Today, Yesterday, This week, Last week, This month, Last month and Custom. */
export const DEFAULT_PRESETS: DatePreset[] = [
  { id: 'today', label: 'Today', range: (today) => ({ start: startOfDay(today), end: startOfDay(today) }) },
  {
    id: 'yesterday',
    label: 'Yesterday',
    range: (today) => {
      const day = addDays(today, -1);
      return { start: day, end: day };
    },
  },
  {
    id: 'this-week',
    label: 'This week',
    range: (today, weekStartsOn) => ({ start: startOfWeek(today, weekStartsOn), end: endOfWeek(today, weekStartsOn) }),
  },
  {
    id: 'last-week',
    label: 'Last week',
    range: (today, weekStartsOn) => {
      const start = addDays(startOfWeek(today, weekStartsOn), -7);
      return { start, end: addDays(start, 6) };
    },
  },
  { id: 'this-month', label: 'This month', range: (today) => ({ start: startOfMonth(today), end: endOfMonth(today) }) },
  {
    id: 'last-month',
    label: 'Last month',
    range: (today) => {
      const start = startOfMonth(addMonths(today, -1));
      return { start, end: endOfMonth(start) };
    },
  },
  { id: 'custom', label: 'Custom' },
];

export interface DatePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onChange' | 'defaultValue'> {
  /** Figma "Type". `Custom` is the panel; `Presets` is the list of pre-defined ranges alone. */
  type?: DatePickerType;
  /** The chosen range (controlled). `end` is `null` until the second day is chosen. */
  value?: DateRange;
  /** The range to start with, when the picker keeps it itself. */
  defaultValue?: DateRange;
  /** Called when the range changes: a preset, a day, or a date typed in a field. */
  onChange?: (range: DateRange) => void;
  /** Called by the primary button of the footer with the range. It is off until both days are chosen. */
  onApply?: (range: DateRange) => void;
  /** Called by the secondary button of the footer. */
  onCancel?: () => void;
  /** Called by the close button of the header. */
  onClose?: () => void;
  /** Called when "Custom" is pressed in the list of presets. */
  onCustom?: () => void;
  /**
   * Figma boolean "Header". `true` shows the header with the `title` and a close
   * button (`onClose`); pass your own <DialogHeader> to change it.
   */
  header?: Slot;
  /** The title in the header. */
  title?: ReactNode;
  /**
   * Figma boolean "Presets": the list of pre-defined ranges beside the dates.
   * It is hidden on Mobile, as in Figma, where it has a screen of its own
   * (`type="Presets"`).
   */
  presets?: boolean;
  /** The options of the list; `DEFAULT_PRESETS` are Figma's. */
  presetOptions?: DatePreset[];
  /** Figma boolean "Text inputs": a field for the first and a field for the last day, as `YYYY-MM-DD`. */
  textInputs?: boolean;
  /**
   * Figma boolean "Footer". `true` shows Cancel and Apply (`onCancel`,
   * `onApply`); pass your own <DialogFooter> to change it.
   */
  footer?: Slot;
  /** The first of the months on show (controlled). The second is the month after it. */
  month?: Date;
  /** The month to start with: the first day of the range, or today. */
  defaultMonth?: Date;
  /** Called when the months on show change, with the first of them. */
  onMonthChange?: (month: Date) => void;
  /** Today, for the presets. */
  today?: Date;
  /** The first day of the week: 0 is Sunday, 1 is Monday. */
  weekStartsOn?: Weekday;
  /** The locale of the weekday, month and date names. */
  locale?: string;
  ref?: Ref<HTMLDivElement>;
}

const EMPTY: DateRange = { start: null, end: null };
const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(' ');
const sameRange = (a: DateRange, b: DateRange) => isSameDay(a.start, b.start) && isSameDay(a.end, b.end);

/** Moves the focus to a day of a calendar column, if it is there. */
function focusDay(root: HTMLElement | null, date: Date): boolean {
  const cell = root?.querySelector<HTMLElement>(`[data-key="${dayKey(date)}"]`);
  if (!cell) return false;
  cell.focus();
  return true;
}

/**
 * Impact DS Date picker — converted from the Figma "Date picker" component set
 * (node 9587:6978): Type `Custom`, a panel to pick a range of days, and `Presets`,
 * the list of pre-defined ranges alone. The panel is the header (title and
 * close), the list of presets, two fields for the first and the last day, two
 * months of days, each under a Calendar header, and a footer with two buttons;
 * the Figma booleans Header, Presets, Text inputs and Footer are props. It is
 * built from the Dialog header and footer, the Text input group, the Calendar
 * header and the Time picker.
 *
 * Pick a first and a last day, in either order, in the grid, with the keyboard
 * (arrows, Page Up and Page Down carry on into the neighbouring month) or by
 * typing `YYYY-MM-DD` in the fields. The band follows the pointer while the
 * last day is open. The chips of the headers open a list of months or of
 * years in their grid. A preset sets the range; "Custom" hands over to the
 * fields. The picker keeps its own state unless `value` and `month` are given.
 *
 * Desktop and Mobile differ through the breakpoint variables, as in Figma: on
 * Desktop the panel is as wide as the viewport up to 1024, and shows the presets
 * and a second month (`device/desktop`); on Mobile it is the 375 wide sheet with
 * a drag handle above it (`device/mobile`), one month, and the fields and the
 * footer buttons stacked. Use the Breakpoint switch in the toolbar to see both.
 *
 * Where the panel has less room than the 1024 of Figma (a docs page, a small
 * window) the two months share the width and their days narrow (50 wide in Figma,
 * 44 at the least): both months stay side by side, with the presets beside them,
 * from 913 wide; under that the presets run in a row above the dates, and under
 * 736 the months drop under each other.
 */
export function DatePicker({
  type = 'Custom',
  value,
  defaultValue,
  onChange,
  onApply,
  onCancel,
  onClose,
  onCustom,
  header = true,
  title = 'Select dates',
  presets = true,
  presetOptions = DEFAULT_PRESETS,
  textInputs = true,
  footer = true,
  month: monthProp,
  defaultMonth,
  onMonthChange,
  today: todayProp,
  weekStartsOn = 1,
  locale = 'en-GB',
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: DatePickerProps) {
  const titleId = useId();
  const today = todayProp ?? new Date();

  // The range: its own, or the one given.
  const [innerRange, setInnerRange] = useState<DateRange>(defaultValue ?? EMPTY);
  const range = value ?? innerRange;
  const commit = (next: DateRange) => {
    if (value === undefined) setInnerRange(next);
    onChange?.(next);
  };

  // The first month on show.
  const [innerMonth, setInnerMonth] = useState(() => startOfMonth(defaultMonth ?? (value ?? defaultValue)?.start ?? today));
  const month = monthProp ? startOfMonth(monthProp) : innerMonth;
  const setMonth = (next: Date) => {
    const first = startOfMonth(next);
    if (monthProp === undefined) setInnerMonth(first);
    onMonthChange?.(first);
  };

  const [leftView, setLeftView] = useState<TimePickerTime>('Day');
  const [rightView, setRightView] = useState<TimePickerTime>('Day');
  const [hover, setHover] = useState<Date | null>(null);
  const [forceCustom, setForceCustom] = useState(false);
  const [draft, setDraft] = useState<{ start?: string; end?: string }>({});
  const [invalid, setInvalid] = useState<{ start?: boolean; end?: boolean }>({});

  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const startInput = useRef<HTMLInputElement>(null);
  const pendingFocus = useRef<Date | null>(null);

  // After a key paged the months, the focus lands on the day it was heading to.
  const monthStamp = month.getTime();
  useEffect(() => {
    const date = pendingFocus.current;
    if (!date) return;
    pendingFocus.current = null;
    if (!focusDay(leftRef.current, date)) focusDay(rightRef.current, date);
  }, [monthStamp]);

  /** The second month is shown on Desktop only (`device/desktop`). */
  const secondVisible = () => !!rightRef.current && getComputedStyle(rightRef.current).display !== 'none';

  /** Pages the months so that a day is on show, in the second month when there are two. */
  const reveal = (date: Date) => {
    const target = startOfMonth(date);
    const second = secondVisible() && rightView === 'Day';
    if (target.getTime() === month.getTime() || (second && target.getTime() === addMonths(month, 1).getTime())) return;
    setMonth(target < month ? target : second ? addMonths(target, -1) : target);
  };

  // A key left the month on show: carry on into the other grid, or page.
  const navigateDay = (date: Date) => {
    const target = startOfMonth(date);
    const second = secondVisible() && rightView === 'Day';
    if (second && target.getTime() === addMonths(month, 1).getTime() && focusDay(rightRef.current, date)) return;
    if (leftView === 'Day' && target.getTime() === month.getTime() && focusDay(leftRef.current, date)) return;
    pendingFocus.current = date;
    requestAnimationFrame(() => {
      pendingFocus.current = null;
    });
    reveal(date);
  };

  const pick = (date: Date) => {
    if (!range.start || range.end) commit({ start: date, end: null });
    else if (date < range.start) commit({ start: date, end: range.start });
    else commit({ start: range.start, end: date });
  };

  // The presets.
  const customId = presetOptions.find((option) => !option.range)?.id;
  const matched = presetOptions.find((option) => option.range && sameRange(option.range(today, weekStartsOn), range));
  const activeId = forceCustom ? customId : (matched?.id ?? customId);
  const choose = (option: DatePreset) => {
    if (!option.range) {
      setForceCustom(true);
      onCustom?.();
      startInput.current?.focus();
      return;
    }
    const next = option.range(today, weekStartsOn);
    setForceCustom(false);
    commit(next);
    if (next.start) setMonth(next.start);
  };

  const presetList = (
    <div role="group" aria-label="Presets" className={styles.presetList}>
      {presetOptions.map((option) => (
        <Chip
          key={option.id}
          size="M"
          icon="False"
          className={styles.preset}
          selected={option.id === activeId}
          onClick={() => choose(option)}
        >
          {option.label}
        </Chip>
      ))}
    </div>
  );

  if (type === 'Presets') {
    return (
      <div
        {...rest}
        ref={ref}
        role="group"
        aria-label={ariaLabel ?? 'Presets'}
        aria-labelledby={ariaLabelledBy}
        className={cx(styles.presetsCard, className)}
      >
        {presetList}
      </div>
    );
  }

  // The fields: a date typed in full replaces the day; anything else waits for the field to be left.
  const typeDate = (side: 'start' | 'end', text: string) => {
    setDraft((current) => ({ ...current, [side]: text }));
    if (text.trim() === '') {
      setInvalid((current) => ({ ...current, [side]: false }));
      commit(side === 'start' ? { start: null, end: range.end } : { start: range.start, end: null });
      return;
    }
    const date = parseISODate(text);
    // An end before the start (or the other way round) is not taken.
    const bad = !date || (side === 'start' ? !!range.end && date > range.end : !!range.start && date < range.start);
    setInvalid((current) => ({ ...current, [side]: bad && text.trim().length >= 10 }));
    if (!date || bad) return;
    commit(side === 'start' ? { start: date, end: range.end } : { start: range.start, end: date });
    reveal(date);
  };
  const leaveField = (side: 'start' | 'end') => {
    setDraft((current) => {
      const next = { ...current };
      delete next[side];
      return next;
    });
    setInvalid((current) => ({ ...current, [side]: false }));
  };

  const dateFormat = new Intl.DateTimeFormat(locale, { dateStyle: 'long' });
  const monthName = new Intl.DateTimeFormat(locale, { month: 'long' });
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(month);
  const summary = range.start
    ? `Selected ${dateFormat.format(range.start)}${range.end ? ` to ${dateFormat.format(range.end)}` : ', now choose the last day'}`
    : '';
  const previewDate = range.start && !range.end ? hover : null;

  const renderMonth = (side: 'left' | 'right') => {
    const shown = side === 'left' ? month : addMonths(month, 1);
    const view = side === 'left' ? leftView : rightView;
    const setView = side === 'left' ? setLeftView : setRightView;
    // The first month to put on show so that a date is in this column.
    const place = (date: Date) => (side === 'left' ? date : addMonths(date, -1));
    const step = view === 'Day' ? 1 : view === 'Month' ? 12 : 144;
    const unit = view === 'Day' ? 'month' : view === 'Month' ? 'year' : '12 years';
    return (
      <div ref={side === 'left' ? leftRef : rightRef} className={cx(styles.month, side === 'right' && styles.second)}>
        <CalendarHeader
          arrows={side === 'left' ? 'Both sides' : 'Right'}
          month={monthName.format(shown)}
          year={shown.getFullYear()}
          previousLabel={`Previous ${unit}`}
          nextLabel={`Next ${unit}`}
          monthExpanded={view === 'Month'}
          yearExpanded={view === 'Year'}
          onPrevious={() => setMonth(addMonths(month, -step))}
          onNext={() => setMonth(addMonths(month, step))}
          onMonthClick={() => setView(view === 'Month' ? 'Day' : 'Month')}
          onYearClick={() => setView(view === 'Year' ? 'Day' : 'Year')}
        />
        <TimePicker
          time={view}
          month={shown}
          value={view === 'Day' ? undefined : shown}
          range={view === 'Day' ? range : undefined}
          previewDate={view === 'Day' ? previewDate : null}
          weekStartsOn={weekStartsOn}
          locale={locale}
          onPreview={view === 'Day' ? setHover : undefined}
          onSelect={(date) => {
            if (view === 'Day') {
              pick(date);
              return;
            }
            // A month or a year of the list: show it, in days.
            setMonth(place(view === 'Month' ? date : new Date(date.getFullYear(), shown.getMonth(), 1)));
            setView('Day');
          }}
          onNavigate={(date) => {
            if (view === 'Day') navigateDay(date);
            else setMonth(place(view === 'Month' ? date : new Date(date.getFullYear(), shown.getMonth(), 1)));
          }}
        />
      </div>
    );
  };

  const headerNode =
    header === true ? (
      <DialogHeader title={title} leftIcons={false} additionalIcons={false} onClose={onClose} titleId={titleId} />
    ) : isShown(header) ? (
      header
    ) : null;
  const footerNode =
    footer === true ? (
      <DialogFooter
        buttonWidth="2 CTA"
        secondaryButton={
          <Button hierarchy="Secondary" size="L" onClick={onCancel}>
            Cancel
          </Button>
        }
        primaryButton={
          <Button hierarchy="Primary" size="L" disabled={!range.start || !range.end} onClick={() => onApply?.(range)}>
            Apply
          </Button>
        }
      />
    ) : isShown(footer) ? (
      footer
    ) : null;
  const label = ariaLabelledBy ?? (ariaLabel === undefined && header === true && title != null ? titleId : undefined);

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      aria-labelledby={label}
      {...rest}
      ref={ref}
      className={cx(styles.picker, className)}
    >
      <div className={styles.handle} aria-hidden />
      <div className={styles.content}>
        {headerNode && <div className={styles.header}>{headerNode}</div>}
        <div className={styles.body}>
          {presets && <div className={styles.presets}>{presetList}</div>}
          <div className={styles.custom}>
            {textInputs && (
              <TextInputGroup aria-label="Date range">
                <InputField
                  ref={startInput}
                  label="Start date"
                  placeholder="YYYY-MM-DD"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft.start ?? formatISODate(range.start)}
                  error={invalid.start || undefined}
                  onChange={(event) => typeDate('start', event.target.value)}
                  onBlur={() => leaveField('start')}
                />
                <InputField
                  label="End date"
                  placeholder="YYYY-MM-DD"
                  inputMode="numeric"
                  autoComplete="off"
                  value={draft.end ?? formatISODate(range.end)}
                  error={invalid.end || undefined}
                  onChange={(event) => typeDate('end', event.target.value)}
                  onBlur={() => leaveField('end')}
                />
              </TextInputGroup>
            )}
            <div className={styles.twin}>
              {renderMonth('left')}
              {renderMonth('right')}
            </div>
            {footerNode && <div className={styles.footer}>{footerNode}</div>}
          </div>
        </div>
      </div>
      <span className={styles.live} aria-live="polite" aria-atomic="true">
        {monthLabel}. {summary}
      </span>
    </div>
  );
}

export default DatePicker;
