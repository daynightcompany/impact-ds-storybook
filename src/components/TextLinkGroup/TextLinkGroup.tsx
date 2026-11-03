import { Children, isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TextLinkGroup.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type TextLinkGroupOrientation = 'Horizontal' | 'Vertical';

export interface TextLinkGroupProps extends HTMLAttributes<HTMLUListElement> {
  /** Figma `Potition` (sic): a row that wraps, or a column. */
  orientation?: TextLinkGroupOrientation;
  /** The links, normally `TextLink`s (Figma `Items` slot). Each one gets its own list item. */
  children?: ReactNode;
}

/**
 * Impact DS Text link group — converted from the Figma "Text/Links group"
 * component set (node 9587:6286 in the SMAL Impact Design System (Public)
 * Figma file). A list of Text links: Horizontal fills the width and wraps
 * onto more rows with spacing/m between the links, Vertical stacks them left
 * aligned with spacing/s between. Renders a `ul`; name it with `aria-label`
 * when it is a navigation of its own.
 */
export function TextLinkGroup({
  orientation = 'Horizontal',
  children,
  className,
  ...rest
}: TextLinkGroupProps) {
  const classes = [styles.group, styles[orientation.toLowerCase()], className].filter(Boolean).join(' ');
  return (
    <ul className={classes} {...rest}>
      {Children.toArray(children).map((child, index) => (
        <li key={isValidElement(child) && child.key !== null ? child.key : index} className={styles.item}>
          {child}
        </li>
      ))}
    </ul>
  );
}

export default TextLinkGroup;
