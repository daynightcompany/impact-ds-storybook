import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CardBadges.module.css';
import { ListCard } from '../ListCard/ListCard';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CardBadgesProps extends HTMLAttributes<HTMLDivElement> {
  /** The cards: `ListCard`s. Without any, two are shown, as in Figma. */
  children?: ReactNode;
}

/**
 * Impact DS Card badges — converted from the Figma "Card/Badges" component
 * (node 9587:7828 in the SMAL Impact Design System (Public) Figma file): a
 * centered row of two list cards (`ListCard`, without the top container),
 * spacing/2xs apart. It is not the `CardBadge` strip, which is a single line of
 * text along the top of a card. The cards share the row equally, each between
 * 310 and 640 wide; when the row is too narrow for two they go one under the
 * other. The spacing and the cards follow the breakpoint tokens, so Mobile is
 * smaller.
 */
export function CardBadges({ children, className, ...rest }: CardBadgesProps) {
  const classes = [styles.badges, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <div className={styles.lists}>
        {children ?? (
          <>
            <ListCard />
            <ListCard />
          </>
        )}
      </div>
    </div>
  );
}

export default CardBadges;
