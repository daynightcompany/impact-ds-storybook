import { useId, useImperativeHandle, useRef, useState } from 'react';
import type { ChangeEvent, ComponentPropsWithRef, KeyboardEvent } from 'react';
import styles from './Spinbox.module.css';
import { cx, focusControlOnBoxPress } from '../Field/FieldParts';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface SpinboxProps
  extends Omit<
    ComponentPropsWithRef<'input'>,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'size' | 'min' | 'max' | 'step' | 'prefix'
  > {
  /** The number, for a controlled spinbox. */
  value?: number;
  /** The starting number of an uncontrolled spinbox. */
  defaultValue?: number;
  /** The least value (none by default). */
  min?: number;
  /** The most value (none by default). */
  max?: number;
  /** What the chevrons and the arrow keys add or take (1 by default). */
  step?: number;
  /** Called with the new number, whenever it changes. */
  onChange?: (value: number) => void;
  /** The accessible name of the field (Figma has no visible caption). */
  label?: string;
  /** The accessible name of the up chevron. */
  increaseLabel?: string;
  /** The accessible name of the down chevron. */
  decreaseLabel?: string;
  /** Shows the Hover or Focused look without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
}

/**
 * Impact DS Spinbox — converted from the Figma "Spinbox" component (node
 * 9587:5318): a 56px box with the number, a divider and a pair of chevrons that
 * add or take one `step`. It hugs its width (95px for one digit). The number is
 * a text field with the `spinbutton` role: type it, press ArrowUp / ArrowDown
 * (PageUp / PageDown by ten steps, Home / End for `min` / `max`) or press the
 * chevrons, which stay out of the tab order like the arrows of a native number
 * field. The number is committed, and kept between `min` and `max`, when the
 * field loses focus or Enter is pressed.
 *
 * Figma draws the number at half opacity, like the placeholder of an empty
 * Input field; here it is at full contrast. Figma has one state, so Hover,
 * Focus and Disabled follow the Input field.
 *
 * It takes the props of an `<input>` (`name`, `disabled`, `id`, ...), a `ref`
 * to it, and `className` / `style` for the box.
 */
export function Spinbox({
  value,
  defaultValue,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  label = 'Quantity',
  increaseLabel = 'Increase',
  decreaseLabel = 'Decrease',
  className,
  style,
  disabled,
  id,
  ref,
  onBlur,
  onKeyDown,
  'data-state': dataState,
  ...rest
}: SpinboxProps) {
  const autoId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue ?? (Number.isFinite(min) ? min : 0));
  const current = controlled ? value : inner;
  // The text while it is being typed; null shows the number.
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? String(current);
  const decimals = step % 1 !== 0;

  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const commit = (n: number) => {
    const next = clamp(Math.round(n * 1e6) / 1e6);
    if (!controlled) setInner(next);
    if (next !== current) onChange?.(next);
    setDraft(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.replace(decimals ? /[^\d.-]/g : /[^\d-]/g, '');
    setDraft(text);
    const parsed = Number(text);
    // A number that is already in range is passed on while typing.
    if (text !== '' && text !== '-' && Number.isFinite(parsed) && parsed >= min && parsed <= max) {
      if (!controlled) setInner(parsed);
      if (parsed !== current) onChange?.(parsed);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    const keys: Record<string, () => void> = {
      ArrowUp: () => commit(current + step),
      ArrowDown: () => commit(current - step),
      PageUp: () => commit(current + step * 10),
      PageDown: () => commit(current - step * 10),
      Home: () => Number.isFinite(min) && commit(min),
      End: () => Number.isFinite(max) && commit(max),
      Enter: () => commit(draft !== null && draft !== '' && draft !== '-' ? Number(draft) : current),
    };
    const action = keys[event.key];
    if (action) {
      if (event.key !== 'Enter') event.preventDefault();
      action();
    }
  };

  return (
    <span
      className={cx(styles.spinbox, disabled && styles.disabled, className)}
      style={style}
      data-state={dataState}
    >
      <span className={styles.number} onMouseDown={focusControlOnBoxPress(inputRef)}>
        <input
          {...rest}
          ref={inputRef}
          id={id ?? autoId}
          type="text"
          role="spinbutton"
          inputMode={decimals ? 'decimal' : 'numeric'}
          autoComplete="off"
          className={styles.value}
          style={{ width: `${Math.max(shown.length, 1)}ch` }}
          value={shown}
          disabled={disabled}
          aria-label={label}
          aria-valuenow={current}
          aria-valuemin={Number.isFinite(min) ? min : undefined}
          aria-valuemax={Number.isFinite(max) ? max : undefined}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={(event) => event.currentTarget.select()}
          onBlur={(event) => {
            onBlur?.(event);
            commit(draft !== null && draft !== '' && draft !== '-' ? Number(draft) : current);
          }}
        />
      </span>
      <span className={styles.divider} aria-hidden />
      <span className={styles.spin}>
        <button
          type="button"
          tabIndex={-1}
          className={styles.spinButton}
          aria-label={increaseLabel}
          disabled={disabled || current >= max}
          onClick={() => {
            commit(current + step);
            inputRef.current?.focus();
          }}
        >
          <Icon name="chevron-up" />
        </button>
        <button
          type="button"
          tabIndex={-1}
          className={styles.spinButton}
          aria-label={decreaseLabel}
          disabled={disabled || current <= min}
          onClick={() => {
            commit(current - step);
            inputRef.current?.focus();
          }}
        >
          <Icon name="chevron-down" />
        </button>
      </span>
    </span>
  );
}

export default Spinbox;
