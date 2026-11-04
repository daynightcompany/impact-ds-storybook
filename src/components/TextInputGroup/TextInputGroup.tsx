import { Children } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './TextInputGroup.module.css';
import { FieldGroupContext, cx } from '../Field/FieldParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type TextInputGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Impact DS Text input group — converted from the Figma "Text Input group"
 * component set (node 9587:5242): two or more fields in one box with a
 * divider between them, e.g. a first and a last name. The children are
 * <InputField>s (or a <Dropdown>); inside the group they lose their own stroke,
 * and a hovered or focused field draws its own, in place of the dividers
 * around it. While one field is focused, open or in error, hovering another
 * one only changes the colour of the outline that is already there.
 *
 * Responsive: the fields share one row while each of them has its minimum
 * width (310). When the group is narrower than that, whatever the reason (a
 * narrow container, a layout that changes), they regroup into a vertical
 * stack, one field per row, with a horizontal divider between the rows. On
 * Mobile the stack is always vertical. Give the group an accessible name with
 * `aria-label`.
 */
export function TextInputGroup({ className, style, children, ...rest }: TextInputGroupProps) {
  // The room the row needs is one minimum width per field (see .group in the CSS).
  const fields = Math.max(1, Children.toArray(children).length);
  return (
    <div
      role="group"
      {...rest}
      style={{ '--group-fields': fields, ...style } as CSSProperties}
      className={cx(styles.group, className)}
    >
      <FieldGroupContext.Provider value>{children}</FieldGroupContext.Provider>
    </div>
  );
}

export default TextInputGroup;
