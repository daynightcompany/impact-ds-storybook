import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ListCard.module.css';
import { CellList } from '../CellList/CellList';
import { Divider } from '../Divider/Divider';
import { Label } from '../Label/Label';
import { SimpleTextBlock } from '../SimpleTextBlock/SimpleTextBlock';
import { textSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface ListCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma boolean "showTopContainer": a label and a text block over the list. */
  showTopContainer?: boolean;
  /** Figma boolean "showLabel": the label of the top container. */
  showLabel?: boolean;
  /** Figma boolean "showTextBlock": the title and subtitle of the top container. */
  showTextBlock?: boolean;
  /** The text of the label. */
  label?: ReactNode;
  /** The title of the text block. Pass a heading element to make it one. */
  title?: ReactNode;
  /** The subtitle of the text block. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  subtitle?: TextSlot;
  /**
   * The rows of the list: `CellList` rows, with a `Divider` (give it
   * `aria-hidden`) between them. Without any, three rows are shown, as in Figma.
   */
  children?: ReactNode;
}

/**
 * Impact DS List card — converted from the Figma "Card/Lists" component (node
 * 9587:7814 in the SMAL Impact Design System (Public) Figma file): a list of
 * `CellList` rows with a divider between them, on a background/primary card with
 * corner radius m, spacing/s of padding and a 5 px background blur. With
 * `showTopContainer` a label and a text block (title and subtitle) stand over the
 * list. It is as wide as the space it is in (400 in the Figma frame) and at
 * least 160. The padding, corner radius, row height and type follow the
 * breakpoint tokens, so Mobile is smaller.
 */
export function ListCard({
  showTopContainer = false,
  showLabel = true,
  showTextBlock = true,
  label = 'Label',
  title = 'Title',
  subtitle,
  children,
  className,
  ...rest
}: ListCardProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');
  const hasTop = showTopContainer && (showLabel || showTextBlock);
  return (
    <div className={classes} {...rest}>
      {hasTop && (
        <div className={styles.top}>
          {showLabel && (
            <Label size="S" tone="gray">
              {label}
            </Label>
          )}
          {showTextBlock && (
            <SimpleTextBlock size="L" eyebrow={false} subtitle={textSlot(subtitle, 'Subtitle')}>
              {title}
            </SimpleTextBlock>
          )}
        </div>
      )}
      <div className={styles.items}>
        {children ?? (
          <>
            <CellList />
            <Divider aria-hidden="true" />
            <CellList />
            <Divider aria-hidden="true" />
            <CellList />
          </>
        )}
      </div>
    </div>
  );
}

export default ListCard;
