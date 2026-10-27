import { useContext } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './SegmentControl.module.css';
import { SegmentContext } from './SegmentContext';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface SegmentItemProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'checked' | 'defaultChecked' | 'children'> {
  /** Identifies the segment; the control's `value` matches against it. */
  value: string;
  /** The label, or an icon. An icon-only segment needs an `aria-label`. */
  children?: ReactNode;
}

/**
 * One segment of a <SegmentControl> — the Figma "Base/SwitchButton" (node
 * 9587:3563) in its Active / Inactive conditions. Size comes from the control.
 * Active is a white pill with black text; inactive has no fill.
 */
export function SegmentItem({ value, children = 'Segment', className, disabled, onChange, ...rest }: SegmentItemProps) {
  const group = useContext(SegmentContext);
  if (!group) throw new Error('<SegmentItem> must be rendered inside a <SegmentControl>.');

  const checked = group.value === value;
  const isDisabled = disabled ?? group.disabled;

  const classes = [styles.item, checked && styles.active, isDisabled && styles.disabled, className]
    .filter(Boolean)
    .join(' ');

  return (
    <label className={classes}>
      <input
        type="radio"
        className={styles.input}
        name={group.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={(event) => {
          onChange?.(event);
          if (!event.defaultPrevented) group.select(value);
        }}
        {...rest}
      />
      <span className={styles.text}>{children}</span>
    </label>
  );
}

export default SegmentItem;
