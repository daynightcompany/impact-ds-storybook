import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CardRow.module.css';
import { CardWithIcons } from '../CardWithIcons/CardWithIcons';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CardRowProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The cards of the row (Figma: three Card with icons without buttons, which
   * is what you get without it). They share the row equally, each at least 272
   * wide, and the ones that do not fit go on the next line.
   */
  children?: ReactNode;
}

/**
 * Impact DS Card row — converted from the Figma "Card/Card row" component (node
 * 9587:7766 in the SMAL Impact Design System (Public) Figma file): a band on
 * surface/primary, spacing/6xl above and below, with a centered row of cards
 * at most 1284 wide, spacing/l apart. The row keeps spacing/m at its sides when
 * the space is narrower than that. The spacing follows the breakpoint tokens,
 * so Mobile is tighter.
 */
export function CardRow({ children, className, ...rest }: CardRowProps) {
  const classes = [styles.row, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <div className={styles.container}>
        <div className={styles.cards}>
          {children ?? [0, 1, 2].map((index) => <CardWithIcons key={index} cta={false} />)}
        </div>
      </div>
    </div>
  );
}

export default CardRow;
