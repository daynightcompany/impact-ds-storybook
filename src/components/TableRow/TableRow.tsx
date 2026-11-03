import { createContext, useContext } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TableRow.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * Figma Type of the "Table row" set:
 * - `Default`  a row of data
 * - `Hover`    the row under the pointer (a `Default` row shows it by itself
 *              when hovered; set it to show it statically)
 * - `Header`   the column headings
 */
export type TableRowType = 'Default' | 'Hover' | 'Header';

export interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  type?: TableRowType;
  /** Figma `Cells` slot: a `TableCell` for each column. */
  children?: ReactNode;
}

export interface TableCellProps extends HTMLAttributes<HTMLDivElement> {
  /** How many columns the cell covers. */
  span?: number;
  children?: ReactNode;
}

// The cells of a header row are column headers, all others plain cells.
const RowTypeContext = createContext<TableRowType>('Default');

/**
 * Impact DS Table row — converted from the Figma "Table row" component set
 * (node 9587:6410) in the SMAL Impact Design System file. Type: Default, Hover
 * and Header.
 *
 * A row is a CSS grid whose columns come from the Table (`columns`); on its
 * own, every cell is an equal column. As in Figma the cells form one band,
 * centred in the row, with each cell at the top of it; a header row centres
 * its cells instead. A Default row is at least 72 high and grows with its
 * content, a Header row is 72 high.
 *
 * Built from divs with the row, columnheader and cell roles, so it belongs
 * inside a Table (role table).
 */
export function TableRow({ type = 'Default', className, children, ...rest }: TableRowProps) {
  const classes = [styles.row, styles[`type-${type.toLowerCase()}`], className].filter(Boolean).join(' ');
  return (
    <RowTypeContext.Provider value={type}>
      <div role="row" className={classes} {...rest}>
        {children}
      </div>
    </RowTypeContext.Provider>
  );
}

/**
 * One cell of a Table row: a column header in a Header row, a cell in the
 * others. Figma has no cell component, its `Cells` slot holds the content
 * directly (an Avatar, a text block, a Label, a Checkbox…); the cell is the
 * column that content sits in. Content is stacked, left-aligned and keeps its
 * own width. `span` makes it cover more than one column.
 */
export function TableCell({ span = 1, className, style, children, ...rest }: TableCellProps) {
  const rowType = useContext(RowTypeContext);
  return (
    <div
      role={rowType === 'Header' ? 'columnheader' : 'cell'}
      className={[styles.cell, className].filter(Boolean).join(' ')}
      style={span > 1 ? { gridColumn: `span ${span}`, ...style } : style}
      {...rest}
    >
      {children}
    </div>
  );
}

export default TableRow;
