import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Pagination.module.css';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** The Figma `Device` values: Mobile drops the first and last page and can show the info alone. */
export type PaginationDevice = 'Desktop' | 'Mobile';

export interface PaginationProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
  /** The current page, counted from 1. */
  page?: number;
  /** How many pages there are. */
  pageCount?: number;
  onPageChange?: (page: number) => void;
  device?: PaginationDevice;
  /** Figma `Info`: shows `infoText`, e.g. "Showing 1 – 20 of 63" (Desktop) or "20 of 63" (Mobile). */
  info?: boolean;
  infoText?: ReactNode;
  backLabel?: string;
  nextLabel?: string;
}

type Item = number | 'gap';

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

/**
 * Which page buttons to show. Desktop lists 10 buttons, the dots included (9
 * next to the info text, as Figma draws it), and always the same number, so
 * Next does not move while you step through the pages: the first and the last
 * page, and between them the pages around the current one, which is third in
 * its window. Near an edge the window grows to 8 pages (7 with the info), as in
 * Figma. Mobile lists a window of 3 that also keeps the current page third,
 * with no first or last page, and dots where more pages follow or precede.
 * Fewer pages than that are all listed.
 */
export function pageItems(page: number, count: number, device: PaginationDevice, info = false): Item[] {
  if (device === 'Mobile') {
    if (count <= 3) return range(1, count);
    const start = Math.min(Math.max(page - 2, 1), count - 2);
    const end = start + 2;
    return [...(start > 1 ? ['gap' as const] : []), ...range(start, end), ...(end < count ? ['gap' as const] : [])];
  }

  const total = info ? 9 : 10;
  if (count <= total) return range(1, count);
  const edge = total - 2;
  const start = page - 2;
  const end = start + (total - 4) - 1;
  if (start <= 3) return [...range(1, edge), 'gap', count];
  if (end >= count - 2) return [1, 'gap', ...range(count - edge + 1, count)];
  return [1, 'gap', ...range(start, end), 'gap', count];
}

/**
 * Impact DS Pagination — converted from the Figma "Pagination" component set
 * (node 9587:6127 in the SMAL Impact Design System (Public) Figma file):
 * Back and Next buttons around the page buttons, built from the Button
 * component (Tertiary, size L; the current page is Primary). `Device` is a
 * variant in Figma because the Mobile layout lists fewer pages, and with
 * `info` on Mobile it lists none: only Back, the info and Next. Spacing and
 * text sizes still come from the tokens, so the Breakpoint switch in the
 * toolbar shows the Mobile values.
 */
export function Pagination({
  page = 1,
  pageCount = 1,
  onPageChange,
  device = 'Desktop',
  info = false,
  infoText,
  backLabel = 'Back',
  nextLabel = 'Next',
  className,
  ...rest
}: PaginationProps) {
  const mobile = device === 'Mobile';
  const current = Math.min(Math.max(1, Math.round(page)), Math.max(1, pageCount));
  const showPages = !(mobile && info);

  const classes = [
    styles.pagination,
    mobile ? styles.mobile : '',
    mobile && !info ? styles['mobile-pages'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <nav aria-label="Pagination" className={classes} {...rest}>
      {info && !mobile && <span className={styles['info-desktop']}>{infoText}</span>}
      <Button
        hierarchy="Tertiary"
        size="L"
        icon="Leading"
        iconElement={<Icon name="chevron-left" />}
        disabled={current <= 1}
        onClick={() => onPageChange?.(current - 1)}
      >
        {backLabel}
      </Button>
      {info && mobile && <span className={styles['info-mobile']}>{infoText}</span>}
      {showPages && (
        <ol className={styles.pages}>
          {pageItems(current, pageCount, device, info).map((item, i) => (
            <li key={item === 'gap' ? `gap-${i}` : item} className={styles.item}>
              {item === 'gap' ? (
                <span className={styles.gap} aria-hidden>
                  ...
                </span>
              ) : (
                <Button
                  hierarchy={item === current ? 'Primary' : 'Tertiary'}
                  size="L"
                  aria-label={`Page ${item}`}
                  aria-current={item === current ? 'page' : undefined}
                  onClick={() => onPageChange?.(item)}
                >
                  {item}
                </Button>
              )}
            </li>
          ))}
        </ol>
      )}
      <Button
        hierarchy="Tertiary"
        size="L"
        icon="Trailing"
        iconElement={<Icon name="chevron-right" />}
        disabled={current >= pageCount}
        onClick={() => onPageChange?.(current + 1)}
      >
        {nextLabel}
      </Button>
    </nav>
  );
}

export default Pagination;
