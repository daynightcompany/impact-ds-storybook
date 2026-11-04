// Sample content for the Table and Table row stories, taken from the Figma
// Table documentation. Not part of the library.
import { Avatar } from '../Avatar/Avatar';
import { Checkbox } from '../Checkbox/Checkbox';
import { Chip } from '../Chip/Chip';
import { Icon } from '../Icon';
import { Label } from '../Label/Label';
import type { LabelTone } from '../Label/Label';
import { TableCell } from './TableRow';
import styles from './TableRow.samples.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * Figma's columns: an avatar (40), four equal columns and a checkbox (18). The
 * equal columns are at least 120 wide (Figma's are at least 100, and a heading
 * chip is about 110), so on Mobile the table scrolls sideways instead of
 * squeezing them.
 */
export const sampleColumns = '40px repeat(4, minmax(120px, 1fr)) 18px';

/** Figma's text block (Text/Card text block): a title and, optionally, a subtitle. */
export function TextBlock({ title = 'Title', subtitle }: { title?: string; subtitle?: string }) {
  return (
    <>
      <span className={styles.title}>{title}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
    </>
  );
}

/** The checkbox of the Figma rows, drawn at 75% (18 x 18). */
export function SelectBox({ label }: { label: string }) {
  return (
    <span className={styles.select}>
      <span className={styles['select-scale']}>
        <Checkbox label={false} aria-label={label} />
      </span>
    </span>
  );
}

/** One heading: a Chip with a chevron, enlarged as in Figma (56 high, see the CSS). */
export function HeaderChip({ children = 'Chip' }: { children?: string }) {
  return (
    <Chip icon="Leading" iconElement={<Icon name="chevron-down" size={24} fixedStroke />} className={styles['header-chip']}>
      {children}
    </Chip>
  );
}

/**
 * The cells of Figma's header row for `sampleColumns`: four headings and a
 * checkbox. The first heading covers the avatar column and the first text
 * column.
 */
export function HeaderCells() {
  return (
    <>
      <TableCell span={2}>
        <HeaderChip />
      </TableCell>
      <TableCell>
        <HeaderChip />
      </TableCell>
      <TableCell>
        <HeaderChip />
      </TableCell>
      <TableCell>
        <HeaderChip />
      </TableCell>
      <TableCell>
        <SelectBox label="Select all rows" />
      </TableCell>
    </>
  );
}

/** The cells of one of Figma's data rows for `sampleColumns`. */
export function DataCells({ tone = 'dark' }: { tone?: LabelTone }) {
  return (
    <>
      <TableCell>
        <Avatar />
      </TableCell>
      <TableCell>
        <TextBlock subtitle="Subtitle" />
      </TableCell>
      <TableCell>
        <TextBlock />
      </TableCell>
      <TableCell>
        <TextBlock />
      </TableCell>
      <TableCell>
        <Label tone={tone}>Label</Label>
      </TableCell>
      <TableCell>
        <SelectBox label="Select row" />
      </TableCell>
    </>
  );
}
