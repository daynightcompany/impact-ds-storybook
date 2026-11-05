import { isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CookieBanner.module.css';
import { Button, type ButtonHierarchy } from '../Button/Button';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * A button slot. `true` shows the default button, a string is its label, any
 * node replaces it (give a button `size="XL"` so it matches), `false` hides it.
 */
export type CookieBannerButton = boolean | ReactNode;

export interface CookieBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Called by the default Primary button (use a node to bring your own). */
  onAccept?: () => void;
  /** Called by the default Secondary button. */
  onReject?: () => void;
  /** The Primary button (Figma label: "Button"). */
  primaryButton?: CookieBannerButton;
  /** The Secondary button (Figma label: "Reject all"). */
  secondaryButton?: CookieBannerButton;
  /** The text (Figma: the "Accept All Cookies" sentence). */
  children?: ReactNode;
}

function renderButton(
  value: CookieBannerButton | undefined,
  fallback: string,
  hierarchy: ButtonHierarchy,
  onClick?: () => void,
): ReactNode {
  if (value === false || value === null) return null;
  if (value === undefined || value === true || typeof value === 'string' || typeof value === 'number') {
    return (
      <Button hierarchy={hierarchy} size="XL" onClick={onClick}>
        {value === undefined || value === true ? fallback : value}
      </Button>
    );
  }
  return isValidElement(value) ? value : <>{value}</>;
}

/**
 * Impact DS Cookie banner — converted from the Figma "Cookie banner" component
 * (node 9587:6802) in the SMAL Impact Design System file. A card on the primary
 * background with Shadow L and corner radius m: the text on one side, two XL
 * buttons (Primary and Secondary) on the other. It fills the width it is in;
 * the text takes the room the buttons leave and the buttons drop under it when
 * it would get narrower than 287. The buttons stack over the full width when
 * they would get narrower than 176 each, as in the Figma auto layout, or than
 * their labels need (a label never wraps or runs out of its button, so long
 * labels stack the buttons earlier). On a phone it is text over two full
 * width buttons. It does not position itself: put it at the edge of the screen
 * (or in a Popover or Dialog) and set `role="region"` with an `aria-label`, or
 * `role="dialog"`, as it suits the page. Padding, gaps, radius and the buttons
 * follow the breakpoint tokens.
 */
export function CookieBanner({
  onAccept,
  onReject,
  primaryButton,
  secondaryButton,
  children = 'By clicking “Accept All Cookies”, you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.',
  className,
  ...rest
}: CookieBannerProps) {
  const classes = [styles.banner, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <p className={styles.text}>{children}</p>
      <div className={styles.buttons}>
        {renderButton(primaryButton, 'Button', 'Primary', onAccept)}
        {renderButton(secondaryButton, 'Reject all', 'Secondary', onReject)}
      </div>
    </div>
  );
}

export default CookieBanner;
