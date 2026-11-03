import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CardBadge.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type CardBadgeState = 'Default' | 'Promo';

export interface CardBadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Default is a neutral strip, Promo a green one for an offer. */
  state?: CardBadgeState;
  /** The text of the badge (Figma: "6 Months FREE"). */
  children?: ReactNode;
}

/**
 * Impact DS Card badge — converted from the Figma "Card Badge" component set
 * (node 9587:6233 in the SMAL Impact Design System (Public) Figma file). A
 * strip along the top edge of a card: it fills the width of the card, has
 * rounded top corners and one line of centered text.
 */
export function CardBadge({
  state = 'Default',
  children = '6 Months FREE',
  className,
  ...rest
}: CardBadgeProps) {
  const classes = [styles.badge, styles[state.toLowerCase()], className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export default CardBadge;
