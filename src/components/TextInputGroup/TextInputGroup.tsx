import type { HTMLAttributes } from 'react';
import styles from './TextInputGroup.module.css';
import { FieldGroupContext, cx } from '../Field/FieldParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type TextInputGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Impact DS Text input group — converted from the Figma "Text Input group"
 * component set (node 9587:5242): two or more fields in one box with a 1px
 * divider between them, e.g. a first and a last name. The children are
 * <InputField>s (or a <Dropdown>); inside the group they lose their own stroke,
 * and a hovered or focused field draws its own.
 *
 * Fields are 310px wide at the least and share the row, so they wrap into rows
 * when the group is narrower than two fields (as on Mobile), with a horizontal
 * divider between the rows. Give the group an accessible name with `aria-label`.
 */
export function TextInputGroup({ className, children, ...rest }: TextInputGroupProps) {
  return (
    <div role="group" {...rest} className={cx(styles.group, className)}>
      <FieldGroupContext.Provider value>{children}</FieldGroupContext.Provider>
    </div>
  );
}

export default TextInputGroup;
