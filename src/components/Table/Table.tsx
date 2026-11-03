import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Table.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The width of each column, the same for every row: a CSS
   * `grid-template-columns` value (for example `40px repeat(4, minmax(0, 1fr)) 18px`),
   * or a number for that many equal columns. Without it, every cell of a row
   * is an equal column.
   */
  columns?: string | number;
  /** Figma `Rows` slot: the `TableRow` elements. */
  children?: ReactNode;
}

/**
 * Impact DS Table — converted from the Figma "Table" component (node
 * 9587:6441) in the SMAL Impact Design System file.
 *
 * A stack of rows 4 apart (a header row, then the data rows). The rows share
 * one set of column widths (`columns`), so the cells of the header line up
 * with the cells below them. It fills the width of its container.
 *
 * Built from divs with the table, row, columnheader and cell roles; give it an
 * `aria-label` (or `aria-labelledby`) so it has a name.
 */
export function Table({ columns, className, style, children, ...rest }: TableProps) {
  const template = typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns;
  const rootStyle = template ? ({ '--table-columns': template, ...style } as CSSProperties) : style;
  return (
    <div role="table" className={[styles.table, className].filter(Boolean).join(' ')} style={rootStyle} {...rest}>
      {children}
    </div>
  );
}

export default Table;
