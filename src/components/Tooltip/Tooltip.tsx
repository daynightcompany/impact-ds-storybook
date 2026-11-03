import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Tooltip.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Icon` (true/false): the copy icon after the text. */
  icon?: boolean;
  /** Replaces the default copy icon. */
  iconElement?: ReactNode;
  children?: ReactNode;
}

/**
 * Impact DS Tooltip — converted from the Figma "Tooltip" component set (node
 * 9587:5993 in the SMAL Impact Design System (Public) Figma file).
 * A dark bubble with one line of text and, optionally, a copy icon. Figma
 * defines only the bubble: place it next to its trigger yourself and point
 * the trigger at it with `aria-describedby`.
 */
export function Tooltip({
  icon = true,
  iconElement,
  children = 'Tooltip',
  className,
  ...rest
}: TooltipProps) {
  return (
    <div role="tooltip" className={[styles.tooltip, className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.text}>{children}</span>
      {icon && <span className={styles.icon}>{iconElement ?? <Icon name="copy" />}</span>}
    </div>
  );
}

export default Tooltip;
