import type { AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './TextLink.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** L is Interactive-Label Text 2XL, M is MD and S is XS. */
export type TextLinkSize = 'L' | 'M' | 'S';

export interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: TextLinkSize;
  /**
   * Figma State=Hover. The link shows this by itself under the pointer; set
   * it to show the hover look statically.
   */
  hover?: boolean;
  /** The text of the link (Figma: "Link"). */
  children?: ReactNode;
}

/**
 * Impact DS Text link — converted from the Figma "Text/Links" component set
 * (node 9587:6262 in the SMAL Impact Design System (Public) Figma file). A
 * real `a` element: the text in the label style of its size with a line along the
 * bottom of the text box, which gets thicker on hover. Figma names the
 * hover variants Size6, Size5 and Size4 (they are L, M and S).
 */
export function TextLink({
  size = 'L',
  hover = false,
  children = 'Link',
  className,
  ...rest
}: TextLinkProps) {
  const classes = [styles.link, styles[`size-${size.toLowerCase()}`], hover ? styles.hover : '', className]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={classes} {...rest}>
      {children}
    </a>
  );
}

export default TextLink;
