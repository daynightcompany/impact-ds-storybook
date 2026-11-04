/* Small date helpers shared by the TimePicker (the day, month and year grid)
   and the DatePicker. Dates are local calendar dates at midnight: they are
   never converted to UTC, so a day stays the day the person sees. */

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** A range of days. `end` is null while only the first day is chosen. */
export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
export const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);
export const daysInMonth = (d: Date) => endOfMonth(d).getDate();

/** Adds months, keeping the day of the month where the month is long enough (31 Jan + 1 month = 28 Feb). */
export function addMonths(d: Date, n: number): Date {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), daysInMonth(first)));
}
export const addYears = (d: Date, n: number) => addMonths(d, n * 12);

/** The first day of the week `d` is in. */
export function startOfWeek(d: Date, weekStartsOn: Weekday): Date {
  return addDays(startOfDay(d), -((d.getDay() - weekStartsOn + 7) % 7));
}
export const endOfWeek = (d: Date, weekStartsOn: Weekday) => addDays(startOfWeek(d, weekStartsOn), 6);

export const isSameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Sortable numbers: one per day, per month and per year. */
export const dayKey = (d: Date) => d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
export const monthKey = (d: Date) => d.getFullYear() * 100 + d.getMonth() + 1;
export const yearKey = (d: Date) => d.getFullYear();

/** The first year of the group of 12 years that holds `year` (2026 is in 2016 to 2027). */
export const yearPageStart = (year: number) => Math.floor(year / 12) * 12;

/** `YYYY-MM-DD`, the format of the text fields. */
export function formatISODate(d: Date | null | undefined): string {
  if (!d) return '';
  const y = String(d.getFullYear()).padStart(4, '0');
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Reads `YYYY-MM-DD`; anything else, or a day that does not exist, is null. */
export function parseISODate(text: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  return date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d ? date : null;
}

/** The short weekday names of a week that starts on `weekStartsOn`. */
export function weekdayNames(locale: string, weekStartsOn: Weekday): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  // 4 Jan 2026 is a Sunday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2026, 0, 4 + ((weekStartsOn + i) % 7))));
}

/** The names of the twelve months. */
export function monthNames(locale: string, style: 'long' | 'short' = 'long'): string[] {
  const fmt = new Intl.DateTimeFormat(locale, { month: style });
  return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2026, i, 1)));
}
