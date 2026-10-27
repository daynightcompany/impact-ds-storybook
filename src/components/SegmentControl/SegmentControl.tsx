import { useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styles from './SegmentControl.module.css';
import { SegmentContext, type SegmentControlSize } from './SegmentContext';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type { SegmentControlSize };

export interface SegmentControlProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * Figma Size: M = 40px tall with 4px corners (Desktop and Mobile), L = 48px
   * tall and fully rounded.
   */
  size?: SegmentControlSize;
  /** Selected segment (controlled). Matches the `value` of a <SegmentItem>. */
  value?: string;
  /** Initially selected segment (uncontrolled). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Form field name shared by the segments. Generated when left out. */
  name?: string;
  disabled?: boolean;
}

/**
 * Impact DS Segment control — converted from the Figma "Segment control"
 * component set (node 9587:3615), built on "Base/SwitchButton" 9587:3563. 2
 * sizes; the Items slot holds the segments, each a <SegmentItem>.
 *
 * A track with 4px padding and 4px between segments; the selected segment is a
 * white pill. Figma has no hover or disabled state: an unselected segment
 * fills like a Tab/Secondary on hover and a disabled one fades to 30%.
 *
 * It is a radio group: the segments are native radio inputs that share one
 * name, so Tab enters the group once and the arrow keys move and select. Give
 * the control an `aria-label`.
 */
export function SegmentControl({
  size = 'M',
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  disabled,
  className,
  children,
  ...rest
}: SegmentControlProps) {
  const generatedName = useId();
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;

  const select = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  return (
    <SegmentContext.Provider value={{ size, name: name ?? generatedName, value, disabled, select }}>
      <div
        role="radiogroup"
        aria-disabled={disabled || undefined}
        className={[styles.control, styles[`size-${size.toLowerCase()}`], className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    </SegmentContext.Provider>
  );
}

export default SegmentControl;
