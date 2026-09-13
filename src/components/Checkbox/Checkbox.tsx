import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';
import '../../styles/tokens.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Whether to show the text label — matches Figma's own `label` boolean prop. */
  label?: boolean;
  children?: ReactNode;
}

/**
 * Impact DS Checkbox — converted from the Figma "Checkbox" component
 * (node 3304:10132).
 *
 * Built on a real, visually-hidden native <input type="checkbox"> so
 * idle/hover/checked/disabled/focus are all driven by real CSS state.
 * `label` (boolean, default true) matches Figma's own prop exactly;
 * `children` supplies the text, defaulting to "Label" as Figma does.
 *
 * The checkmark is Figma's real "check-alternative" icon (confirmed
 * path + stroke color, not the generic placeholder glyph this file
 * used to reuse from Radiobutton).
 */
export function Checkbox({ label = true, children = 'Label', className, id, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <input id={inputId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.fill} />
        <svg viewBox="0 0 16 16" width={16} height={16} fill="none" className={styles.check}>
          <path
            d="M3.5 7.47059L6.83333 11L12.5 5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {label && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export default Checkbox;
