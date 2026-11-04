import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CalendarHeader.module.css';
import { Button } from '../Button/Button';
import { Chip } from '../Chip/Chip';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma "Arrows": which sides have an arrow button. */
export type CalendarHeaderArrows = 'Left' | 'Right' | 'Both sides';

export interface CalendarHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma "Single select". `true` shows the month and the year as two chips with
   * a chevron, each a button (`onMonthClick`, `onYearClick`) that opens a list to
   * pick from. `false` shows the month alone, as a plain title.
   */
  singleSelect?: boolean;
  /** Figma "Arrows": the previous button, the next button, or both. */
  arrows?: CalendarHeaderArrows;
  /** The month, e.g. "January". */
  month?: ReactNode;
  /** The year, e.g. "2026" (`singleSelect` only). */
  year?: ReactNode;
  /** Called by the arrow on the left. */
  onPrevious?: () => void;
  /** Called by the arrow on the right. */
  onNext?: () => void;
  /** Called by the month chip. */
  onMonthClick?: () => void;
  /** Called by the year chip. */
  onYearClick?: () => void;
  /** Accessible name of the left arrow. */
  previousLabel?: string;
  /** Accessible name of the right arrow. */
  nextLabel?: string;
  /** The month chip has opened a list (`aria-expanded`). */
  monthExpanded?: boolean;
  /** The year chip has opened a list (`aria-expanded`). */
  yearExpanded?: boolean;
}

/**
 * Impact DS Calendar header — converted from the Figma "Calendar header"
 * component set (node 9587:7016): Single select (True / False) x Arrows (Left /
 * Right / Both sides). The arrows are the Button component (size L, Tertiary,
 * icon only) and the month and year are Chips (size M, icon trailing, with the
 * XL label text and 12 of padding above and below, so they are as high as the
 * arrows). With one arrow, the other side has spacing/xl of room, so the three
 * variants are about as wide.
 *
 * It is as wide as its content, at the start of the room it has, and never
 * narrower (in a column that is too narrow it overhangs the end of it, and the
 * chips keep clear of the arrows); with `singleSelect` off it fills the width
 * and centres the title. The sizes follow
 * the Breakpoint switch in the toolbar (the arrows are 48 on Mobile).
 */
export function CalendarHeader({
  singleSelect = true,
  arrows = 'Both sides',
  month = 'January',
  year = '2026',
  onPrevious,
  onNext,
  onMonthClick,
  onYearClick,
  previousLabel = 'Previous month',
  nextLabel = 'Next month',
  monthExpanded,
  yearExpanded,
  className,
  ...rest
}: CalendarHeaderProps) {
  const left = arrows === 'Left' || arrows === 'Both sides';
  const right = arrows === 'Right' || arrows === 'Both sides';
  const classes = [
    styles.header,
    !singleSelect && styles.fill,
    arrows === 'Left' && styles['arrows-left'],
    arrows === 'Right' && styles['arrows-right'],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const chevron = <Icon name="chevron-down" size={24} fixedStroke />;

  return (
    <div {...rest} className={classes}>
      {left && (
        <Button
          type="button"
          hierarchy="Tertiary"
          size="L"
          icon="Only"
          iconElement={<Icon name="arrow-left" size={24} />}
          className={styles.arrow}
          aria-label={previousLabel}
          onClick={onPrevious}
        />
      )}
      <div className={styles.container}>
        {singleSelect ? (
          <>
            <Chip
              size="M"
              icon="Trailing"
              iconElement={chevron}
              className={styles.chip}
              aria-expanded={monthExpanded}
              onClick={onMonthClick}
            >
              {month}
            </Chip>
            <Chip
              size="M"
              icon="Trailing"
              iconElement={chevron}
              className={styles.chip}
              aria-expanded={yearExpanded}
              onClick={onYearClick}
            >
              {year}
            </Chip>
          </>
        ) : (
          <span className={styles.title}>{month}</span>
        )}
      </div>
      {right && (
        <Button
          type="button"
          hierarchy="Tertiary"
          size="L"
          icon="Only"
          iconElement={<Icon name="arrow-right" size={24} />}
          className={styles.arrow}
          aria-label={nextLabel}
          onClick={onNext}
        />
      )}
    </div>
  );
}

export default CalendarHeader;
