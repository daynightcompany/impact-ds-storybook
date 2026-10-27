import type { HTMLAttributes } from 'react';
import styles from './Divider.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type DividerProps = HTMLAttributes<HTMLHRElement>;

/**
 * Impact DS Divider — converted from the Figma "Divider" component (node
 * 9587:594): a 1px line in border/primary that fills the width of its
 * container. Renders an <hr>, so it is a separator for assistive tech; pass
 * `aria-hidden` when it only decorates a list.
 */
export function Divider({ className, ...rest }: DividerProps) {
  return <hr className={[styles.divider, className].filter(Boolean).join(' ')} {...rest} />;
}

export default Divider;
