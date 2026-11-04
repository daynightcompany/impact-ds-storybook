import { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react';
import styles from './Table.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The width of each column, the same for every row: a CSS
   * `grid-template-columns` value (for example `40px repeat(4, minmax(120px, 1fr)) 18px`),
   * or a number for that many equal columns. Without it, every cell of a row
   * is an equal column. Give the columns that share the width a minimum
   * (`minmax(120px, 1fr)`): the table never squeezes them below it, and scrolls
   * sideways when its container is narrower than all of them (as on Mobile).
   */
  columns?: string | number;
  /** Figma `Rows` slot: the `TableRow` elements. */
  children?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Impact DS Table — converted from the Figma "Table" component (node
 * 9587:6441) in the SMAL Impact Design System file.
 *
 * A stack of rows 4 apart (a header row, then the data rows). The rows share
 * one set of column widths (`columns`), so the cells of the header line up
 * with the cells below them. It fills the width of its container. When the
 * container is narrower than the columns' minimum widths (Mobile) the rows
 * keep those widths and the table scrolls sideways; while it does it is a tab
 * stop, so the keyboard can scroll it.
 *
 * Built from divs with the table, row, columnheader and cell roles; give it an
 * `aria-label` (or `aria-labelledby`) so it has a name.
 */
export function Table({ columns, className, style, children, ref, ...rest }: TableProps) {
  const element = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => element.current as HTMLDivElement);
  const [scrolls, setScrolls] = useState(false);

  // Whether the rows are wider than the table: it is then a scroll region, which needs a tab stop.
  // It looks again when the table or one of its rows changes size.
  useLayoutEffect(() => {
    const el = element.current;
    if (!el) return undefined;
    const measure = () => setScrolls(el.scrollWidth > el.clientWidth + 1);
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    for (const row of Array.from(el.children)) resize.observe(row);
    return () => resize.disconnect();
  });

  const template = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  const rootStyle = template ? ({ '--table-columns': template, ...style } as CSSProperties) : style;
  return (
    <div
      role="table"
      tabIndex={scrolls ? 0 : undefined}
      {...rest}
      ref={element}
      className={[styles.table, className].filter(Boolean).join(' ')}
      style={rootStyle}
    >
      {children}
    </div>
  );
}

export default Table;
