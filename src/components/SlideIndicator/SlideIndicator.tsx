import type { HTMLAttributes } from 'react';
import styles from './SlideIndicator.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface SlideIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  /** How many pages there are. Up to five are all shown; more keep a window of five that follows the current page. */
  count?: number;
  /** The current page, counted from 1. */
  page?: number;
}

/** Figma draws five marks: the current page and its neighbours. */
const WINDOW = 5;

type Mark = 'active' | 'dot' | 'tiny';

/**
 * Impact DS Slide indicator — converted from the Figma "Slide Indicator"
 * component set (node 9587:6084 in the SMAL Impact Design System (Public)
 * Figma file). A row of page marks: the current page is a 24 x 6 bar, the
 * others are 6px dots, and a mark at the edge of the window shrinks to 2px
 * while more pages lie beyond it. Figma's five `Page` variants are the first
 * page, the second, a middle page, the second to last and the last of a long
 * list. It only shows where you are: it has no buttons.
 */
export function SlideIndicator({ count = 5, page = 1, className, ...rest }: SlideIndicatorProps) {
  const total = Math.max(1, Math.round(count));
  const current = Math.min(Math.max(1, Math.round(page)), total);
  // The window keeps the current page in the middle, and stops at the first and the last five.
  const first = Math.min(Math.max(current - 2, 1), Math.max(total - WINDOW + 1, 1));
  const last = Math.min(first + WINDOW - 1, total);

  const marks: { page: number; kind: Mark }[] = [];
  for (let p = first; p <= last; p += 1) {
    let kind: Mark = p === current ? 'active' : 'dot';
    if (kind === 'dot' && ((p === first && first > 1) || (p === last && last < total))) kind = 'tiny';
    marks.push({ page: p, kind });
  }

  return (
    <div
      role="img"
      aria-label={`Page ${current} of ${total}`}
      className={[styles.indicator, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {marks.map(({ page: p, kind }) => (
        <span key={p} className={[styles.mark, styles[kind]].join(' ')} />
      ))}
    </div>
  );
}

export default SlideIndicator;
