import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Notification.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** The Figma `Category` values. */
export type NotificationCategory =
  | 'dot alert'
  | 'dot warning'
  | 'dot success'
  | 'counter'
  | 'warning';

export interface NotificationProps extends HTMLAttributes<HTMLSpanElement> {
  category?: NotificationCategory;
  /**
   * The text of a `counter` (a number, "1" by default) or of the `warning`
   * mark ("!" by default). The three dots have no text.
   */
  children?: ReactNode;
}

/**
 * Impact DS Notification — converted from the Figma "Notification" component
 * set (node 9587:6011 in the SMAL Impact Design System (Public) Figma file).
 * A small status mark to lay over an icon, an avatar or a menu item: three
 * dots (alert, warning, success), a counter and a warning sign. The dots carry
 * no text, so give one an `aria-label` when it has to be announced; otherwise
 * it is hidden from assistive tech.
 */
export function Notification({
  category = 'counter',
  children,
  className,
  ...rest
}: NotificationProps) {
  const isDot = category.startsWith('dot');
  const classes = [styles.notification, styles[category.replace(' ', '-')], className]
    .filter(Boolean)
    .join(' ');

  if (isDot) {
    const labelled = rest['aria-label'] !== undefined;
    return (
      <span
        role={labelled ? 'img' : undefined}
        aria-hidden={labelled ? undefined : true}
        className={classes}
        {...rest}
      />
    );
  }

  return (
    <span className={classes} {...rest}>
      {children ?? (category === 'warning' ? '!' : '1')}
    </span>
  );
}

export default Notification;
