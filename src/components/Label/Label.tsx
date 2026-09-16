import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';

export type LabelSize = 'S' | 'M';
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
 * (node 2801:25227). This is a purple pill/tag, not an HTML form-field
 * <label> — Figma's naming, not a semantic form label.
 *
 * Figma's own component only defines Size (S/M) and Icon (true/false)
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

  const iconSize = size === 'M' ? 32 : 24;

  return (
    <span className={classes} {...rest}>
      <span>{children}</span>
      {icon && (iconElement ?? <Icon size={iconSize} />)}
    </span>
  );
}

export default Label;
