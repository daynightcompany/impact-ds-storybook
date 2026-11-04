import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, FocusEvent, HTMLAttributes, KeyboardEvent } from 'react';
import styles from './TimePicker.module.css';
import { Chip } from '../Chip/Chip';
import {
  addMonths,
  addYears,
  dayKey,
  daysInMonth,
  monthKey,
  monthNames,
  weekdayNames,
  yearKey,
  yearPageStart,
  type DateRange,
  type Weekday,
} from './dates';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type { DateRange, Weekday } from './dates';

/** The Figma "Time" property: what the grid picks. */
export type TimePickerTime = 'Day' | 'Month' | 'Year';

export interface TimePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'children'> {
  /**
   * Figma "Time": `Day` shows the days of a month under their weekdays, `Month`
   * the 12 months of a year and `Year` a page of 12 years.
   */
  time?: TimePickerTime;
  /**
   * The period on show: any date in the month (`Day`), in the year (`Month`) or
   * in the page of 12 years (`Year`). Defaults to the selected date, or today.
   */
  month?: Date;
  /** Figma "State=Selected single": the selected day, month or year (a dark pill). */
  value?: Date | null;
  /**
   * Figma "State=Selected multi": a range. The first and the last day are dark
   * pills and each row of days between them is joined by a band. Nothing
   * selected is Figma's "State=Default".
   */
  range?: DateRange;
  /**
   * A day, month or year under the pointer or focus while only the first of a
   * `range` is chosen: the band runs to it, so the range can be seen before it
   * is complete. Pass what `onPreview` reports.
   */
  previewDate?: Date | null;
  /** Called with the picked date: the day, the first day of the month, or 1 January of the year. */
  onSelect?: (date: Date) => void;
  /** Called with the date under the pointer or focus, and with `null` when it leaves. */
  onPreview?: (date: Date | null) => void;
  /**
   * Called when a key would move the focus out of the period on show (an arrow
   * on the last day of the month, Page Up, ...), with the date it moves to.
   * Show the period that holds it and the focus follows.
   */
  onNavigate?: (date: Date) => void;
  /** The first day of the week (`Day` only): 0 is Sunday, 1 is Monday. */
  weekStartsOn?: Weekday;
  /** The locale of the weekday, month and date names. */
  locale?: string;
}

interface Cell {
  date: Date;
  key: number;
  label: string;
  name: string;
}

const COLUMNS: Record<TimePickerTime, number> = { Day: 7, Month: 3, Year: 3 };

/** The sortable number of a day, a month or a year, whichever the grid is of. */
function keyFor(time: TimePickerTime, date: Date): number {
  return time === 'Day' ? dayKey(date) : time === 'Month' ? monthKey(date) : yearKey(date);
}

function chunk<T>(items: T[], size: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

/** Two letters of a weekday name ("Mo"), counted in characters, so every script fits the cell. */
const twoLetters = (name: string) => Array.from(name).slice(0, 2).join('');

/**
 * Impact DS Time picker — converted from the Figma "Time picker" component set
 * (node 9587:7046). Despite its name it picks no clock time: it is the grid of
 * the Date picker, in the three values of the Figma property Time: `Day` (a
 * month of days under their weekdays), `Month` (12 months) and `Year` (12
 * years), each in the three Figma states: Default, Selected single and
 * Selected multi.
 *
 * The cells are the Chip component, size M. A selected day is a dark pill; in a
 * range the first and the last are dark and a band (border/tertiary) joins
 * the days between them, drawn per row so it breaks at the end of a week, as
 * in Figma. The Day grid is 7 cells wide, 50 each (40 on Mobile) with 4 between
 * them; Month and Year are 3 cells wide and as wide as the Day grid. Days of
 * the next or previous month are left empty.
 *
 * Keyboard: the grid is one tab stop; arrows move by a day (a month or a year
 * in the other grids), Up and Down by a week (3 cells), Home and End to the
 * start and end of the row, Page Up and Page Down by a month (a year, 12
 * years), Enter or Space picks. Pass `onNavigate` to follow the focus into the
 * neighbouring period.
 *
 * Dates are local calendar dates; the time of day is ignored. Use the
 * Breakpoint switch in the toolbar to see the Mobile cell width.
 */
export function TimePicker({
  time = 'Day',
  month,
  value,
  range,
  previewDate,
  onSelect,
  onPreview,
  onNavigate,
  weekStartsOn = 1,
  locale = 'en-GB',
  className,
  style,
  onKeyDown,
  onBlur,
  onPointerLeave,
  ...rest
}: TimePickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pending = useRef<Date | null>(null);
  const [focusKey, setFocusKey] = useState<number | null>(null);

  const anchor = month ?? value ?? range?.start ?? new Date();
  const year = anchor.getFullYear();
  const monthIndex = anchor.getMonth();
  const anchorKey = dayKey(anchor);
  const cols = COLUMNS[time];

  const { rows, label, weekdays } = useMemo(() => {
    let cells: (Cell | null)[];
    let groupLabel: string;
    if (time === 'Day') {
      const first = new Date(year, monthIndex, 1);
      const lead = (first.getDay() - weekStartsOn + 7) % 7;
      const dayName = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      cells = [
        ...Array.from({ length: lead }, () => null),
        ...Array.from({ length: daysInMonth(first) }, (_, i): Cell => {
          const date = new Date(year, monthIndex, i + 1);
          return { date, key: dayKey(date), label: String(i + 1), name: dayName.format(date) };
        }),
      ];
      groupLabel = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(first);
    } else if (time === 'Month') {
      const names = monthNames(locale, 'short');
      const long = monthNames(locale, 'long');
      cells = names.map((n, i): Cell => {
        const date = new Date(year, i, 1);
        return { date, key: monthKey(date), label: n, name: `${long[i]} ${year}` };
      });
      groupLabel = String(year);
    } else {
      const base = yearPageStart(year);
      cells = Array.from({ length: 12 }, (_, i): Cell => {
        const date = new Date(base + i, 0, 1);
        return { date, key: yearKey(date), label: String(base + i), name: String(base + i) };
      });
      groupLabel = `${base} – ${base + 11}`;
    }
    return {
      rows: chunk(cells, cols),
      label: groupLabel,
      weekdays: time === 'Day' ? weekdayNames(locale, weekStartsOn).map(twoLetters) : [],
    };
  }, [time, year, monthIndex, weekStartsOn, locale, cols]);

  const cellsOnShow = rows.flat().filter((c): c is Cell => c !== null);
  const byKey = new Map(cellsOnShow.map((c) => [c.key, c]));

  const singleKey = value ? keyFor(time, value) : null;
  const startKey = range?.start ? keyFor(time, range.start) : null;
  const endKey = range?.end ? keyFor(time, range.end) : null;
  // While only the first day is chosen, the band runs to the day being previewed.
  const bandEnd = endKey ?? (previewDate ? keyFor(time, previewDate) : null);
  const lo = startKey !== null && bandEnd !== null ? Math.min(startKey, bandEnd) : null;
  const hi = startKey !== null && bandEnd !== null ? Math.max(startKey, bandEnd) : null;

  const firstSelected = [singleKey, startKey, endKey].find((k) => k !== null && byKey.has(k)) ?? null;
  const tabKey = focusKey !== null && byKey.has(focusKey) ? focusKey : (firstSelected ?? cellsOnShow[0]?.key ?? null);

  const focusDate = (date: Date): boolean => {
    const k = keyFor(time, date);
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-key="${k}"]`);
    if (!el) return false;
    setFocusKey(k);
    el.focus();
    return true;
  };

  const goTo = (next: Date) => {
    if (focusDate(next) || !onNavigate) return;
    pending.current = next;
    onNavigate(next);
    // If the period did not change (the parent kept it, or showed the date
    // somewhere else), the request lapses with the next frame.
    requestAnimationFrame(() => {
      pending.current = null;
    });
  };

  // After the period changed because of a key, the focus lands on the date it was heading to.
  useEffect(() => {
    const next = pending.current;
    if (!next) return;
    const k = keyFor(time, next);
    const el = rootRef.current?.querySelector<HTMLElement>(`[data-key="${k}"]`);
    if (el) {
      pending.current = null;
      setFocusKey(k);
      el.focus();
    }
  }, [anchorKey, time]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented) return;
    const target = (e.target as HTMLElement).closest<HTMLElement>('[data-key]');
    const cell = target ? byKey.get(Number(target.dataset.key)) : undefined;
    if (!cell) return;
    const cur = cell.date;
    const step = (n: number) =>
      time === 'Day' ? new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + n) : time === 'Month' ? addMonths(cur, n) : addYears(cur, n);
    const col = time === 'Day' ? (cur.getDay() - weekStartsOn + 7) % 7 : cellsOnShow.findIndex((c) => c.key === cell.key) % cols;
    let next: Date;
    switch (e.key) {
      case 'ArrowLeft':
        next = step(-1);
        break;
      case 'ArrowRight':
        next = step(1);
        break;
      case 'ArrowUp':
        next = step(-cols);
        break;
      case 'ArrowDown':
        next = step(cols);
        break;
      case 'Home':
        next = step(-col);
        break;
      case 'End':
        next = step(cols - 1 - col);
        break;
      case 'PageUp':
        next = time === 'Day' ? addMonths(cur, -1) : addYears(cur, time === 'Month' ? -1 : -12);
        break;
      case 'PageDown':
        next = time === 'Day' ? addMonths(cur, 1) : addYears(cur, time === 'Month' ? 1 : 12);
        break;
      default:
        return;
    }
    e.preventDefault();
    goTo(next);
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    onBlur?.(e);
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) onPreview?.(null);
  };

  return (
    <div
      ref={rootRef}
      role="group"
      aria-label={label}
      {...rest}
      className={[styles.picker, className].filter(Boolean).join(' ')}
      style={{ '--cols': cols, ...style } as CSSProperties}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        onPreview?.(null);
      }}
    >
      {time === 'Day' && (
        <div className={styles.row} aria-hidden>
          {weekdays.map((w, i) => (
            <span key={i} className={styles.weekday}>
              {w}
            </span>
          ))}
        </div>
      )}
      {rows.map((row, r) => {
        let from = -1;
        let to = -1;
        if (lo !== null && hi !== null && lo !== hi) {
          row.forEach((c, i) => {
            if (c && c.key >= lo && c.key <= hi) {
              if (from < 0) from = i;
              to = i;
            }
          });
        }
        const banded = from >= 0;
        return (
          <div
            key={r}
            className={styles.row}
            data-band={banded ? '' : undefined}
            style={banded ? ({ '--band-from': from, '--band-to': to } as CSSProperties) : undefined}
          >
            {row.map((c, i) =>
              c ? (
                <Chip
                  key={c.key}
                  size="M"
                  icon="False"
                  className={styles.cell}
                  selected={c.key === singleKey || c.key === startKey || c.key === endKey}
                  tabIndex={tabKey === c.key ? 0 : -1}
                  aria-label={c.name}
                  data-key={c.key}
                  onClick={() => {
                    setFocusKey(c.key);
                    onSelect?.(c.date);
                  }}
                  onPointerEnter={() => onPreview?.(c.date)}
                  onFocus={() => {
                    // The tab stop follows the focus, wherever it came from.
                    setFocusKey(c.key);
                    onPreview?.(c.date);
                  }}
                >
                  {c.label}
                </Chip>
              ) : (
                <span key={`blank-${i}`} className={styles.blank} aria-hidden />
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TimePicker;
