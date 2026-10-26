import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';

/**
 * Figma size ladder (Desktop height):
 * S = 32px (32px on Mobile), L = 56px (40px on Mobile).
 * Mobile values come from the breakpoint tokens, not from a prop.
 * With or without an icon a size has the same height: the L icon follows
 * spacing/l (32 Desktop, 24 Mobile), the same variable as the text line height.
 */
export type LabelSize = 'S' | 'L';
export type LabelTone =
  | 'purple'   // component's own true default (fill + white text)
  | 'gray'     // documented override: light surface fill + dark text
  | 'dark'     // documented override: dark fill + white text
  | 'warning' | 'error' | 'success'
  | 'orange' | 'salad' | 'ochre' | 'azure' | 'pink' | 'wine';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  size?: LabelSize;
  icon?: boolean;
  tone?: LabelTone;
  iconElement?: ReactNode;
  children?: ReactNode;
}

/**
 * Impact DS Label — converted from the Figma "Base/Label" component
 * (node 9587:4638 in the SMAL Impact Design System (Public) Figma file).
 * This is a purple pill/tag, not an HTML form-field
 * <label> — Figma's naming, not a semantic form label.
 *
 * Figma's own component only defines Size (S/L) and Icon (true/false)
 * as real variants — there is no formal color/hierarchy variant.
 * The documentation page separately demonstrates a set of approved
 * manual fill overrides (a light/dark pair, plus a palette of
 * semantic and neutral accent colors), which is exposed here as the
 * `tone` prop for parity with what the design system documents as
 * supported, even though Figma itself doesn't enforce it as a variant.
 * `tone="purple"` (the default) matches the component's own intrinsic,
 * unmodified appearance.
 */
export function Label({
  size = 'S',
  icon = false,
  tone = 'purple',
  iconElement,
  children = 'Label',
  className,
  ...rest
}: LabelProps) {
  const classes = [
    styles.label,
    styles[`size-${size.toLowerCase()}`],
    styles[`tone-${tone}`],
    icon ? styles['has-icon'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // The box is sized by CSS tokens (see .icon in Label.module.css); the
  // number is only the glyph's intrinsic size before CSS applies.
  const iconSize = size === 'L' ? 32 : 24;

  return (
    <span className={classes} {...rest}>
      <span>{children}</span>
      {icon && <span className={styles.icon}>{iconElement ?? <Icon size={iconSize} />}</span>}
    </span>
  );
}

export default Label;
