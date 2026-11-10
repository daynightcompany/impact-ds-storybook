import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SlidePreviewCard.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma State: Active is the slide that is shown now, Inactive one you can go to. */
export type SlidePreviewCardState = 'Active' | 'Inactive';

export interface SlidePreviewCardProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  state?: SlidePreviewCardState;
  /** The title of the slide (Figma: "Preview card title"). Two lines at most, then it is cut off. */
  children?: ReactNode;
  /** Only for an Inactive card, which goes to its slide: not the Active one. */
  disabled?: boolean;
}

/**
 * Impact DS Slide preview card — converted from the Figma "Card/Slide preview"
 * component set (node 9587:7677 in the SMAL Impact Design System (Public) Figma
 * file): the title of a slide on a rounded card, 272 wide. Active (the slide
 * that is shown) has a border/tertiary fill: it is marked with `aria-current`,
 * it is out of the tab order, and pressing it does nothing. Inactive has no fill
 * and goes to its slide when it is pressed. The card is a button in both states,
 * so it stays the same element when the state changes, and the fill eases in and
 * out over 300ms. The spacing, corner radius and type follow the breakpoint
 * tokens, so Mobile is smaller. Figma has no hover or pressed state for it.
 */
export function SlidePreviewCard({
  state = 'Active',
  children = 'Preview card title',
  disabled,
  className,
  ...rest
}: SlidePreviewCardProps) {
  const active = state === 'Active';
  const classes = [styles.card, active ? styles.active : styles.inactive, className].filter(Boolean).join(' ');
  const content = (
    <span className={styles.content}>
      <span className={styles.title}>{children}</span>
    </span>
  );

  return (
    <button
      type="button"
      className={classes}
      aria-current={active ? 'true' : undefined}
      tabIndex={active ? -1 : undefined}
      disabled={active ? undefined : disabled}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
}

export default SlidePreviewCard;
