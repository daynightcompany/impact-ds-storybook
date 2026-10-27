import { useId, useLayoutEffect, useReducer, useRef, useState } from 'react';
import type { ChangeEvent, CSSProperties, KeyboardEvent } from 'react';
import styles from './CodeInput.module.css';
import field from '../Field/Field.module.css';
import { FieldMessages, cx, resolveFieldMessage, type FieldMessageProps } from '../Field/FieldParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CodeInputProps extends FieldMessageProps {
  /** How many characters the code has, one box each (Figma has 6). */
  length?: number;
  /** The code, for a controlled input. */
  value?: string;
  /** The starting code of an uncontrolled input. */
  defaultValue?: string;
  /** Called with the code (without gaps) whenever it changes. */
  onChange?: (value: string) => void;
  /** Called once, when the last box has been filled. */
  onComplete?: (value: string) => void;
  /** `numeric` accepts digits only (the default), `alphanumeric` letters and digits. */
  type?: 'numeric' | 'alphanumeric';
  /** The accessible name of the code; each box is "<label> digit 1 of 6", and so on. */
  label?: string;
  /** What an empty box shows (Figma "0"). */
  placeholder?: string;
  disabled?: boolean;
  /** Adds a hidden field with the code, for a form. */
  name?: string;
  autoFocus?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
  /** Shows the Hover or Focused look (on the first box) without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
}

const ACCEPT = { numeric: /[^0-9]/g, alphanumeric: /[^a-zA-Z0-9]/g } as const;

/**
 * Impact DS Code input — converted from the Figma "Code input" (node 9587:5359)
 * and its "Base/Input Field" set (node 9587:5028): a verification code with one
 * 56px box per character, sharing the width, with the helper text and link of
 * the Base field below. The Figma booleans Link and Helper text are props;
 * Idle, Hover, Focused and Disabled are the browser's own states, `error` sets
 * Error, and Empty / Populated follow the boxes.
 *
 * Typing fills the boxes in order and moves on; Backspace in an empty box goes
 * back and deletes; the arrow keys, Home and End move between boxes; pasting
 * (or a one-time-code autofill) fills from the box you are in. Boxes are never
 * left with a gap, so `value` is always the code typed so far.
 *
 * Figma's Code input frame has 8px between the boxes, its Base set 12px
 * (spacing/xs); the Base set is followed.
 */
export function CodeInput({
  length = 6,
  value,
  defaultValue = '',
  onChange,
  onComplete,
  type = 'numeric',
  label = 'Code',
  placeholder = '0',
  disabled,
  name,
  autoFocus,
  id,
  className,
  style,
  helperText,
  error,
  link,
  onLinkClick,
  'data-state': dataState,
}: CodeInputProps) {
  const messageId = useId();
  const autoId = useId();
  const controlled = value !== undefined;
  const [inner, setInner] = useState(defaultValue);
  const code = (controlled ? value : inner).slice(0, length);
  const boxes = useRef<Array<HTMLInputElement | null>>([]);
  const { message, hasError } = resolveFieldMessage({ helperText, error });

  const focusBox = (index: number) => {
    const target = boxes.current[Math.max(0, Math.min(length - 1, index))];
    target?.focus();
  };

  // After a change the focus moves on once the boxes show the new code, so a
  // box that is now filled is not mistaken for one past the end of the code.
  const pendingFocus = useRef<number | null>(null);
  const [, rerender] = useReducer((count: number) => count + 1, 0);
  useLayoutEffect(() => {
    if (pendingFocus.current !== null) {
      const index = pendingFocus.current;
      pendingFocus.current = null;
      focusBox(index);
    }
  });
  const focusBoxAfterUpdate = (index: number) => {
    pendingFocus.current = index;
    rerender();
  };

  const update = (next: string) => {
    const clean = next.slice(0, length);
    if (!controlled) setInner(clean);
    if (clean !== code) {
      onChange?.(clean);
      if (clean.length === length) onComplete?.(clean);
    }
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    // A typed character is what the box takes (it may sit next to the old one);
    // a paste or an autofill brings the whole text.
    const native = event.nativeEvent as InputEvent;
    const raw = native.inputType === 'insertText' && native.data ? native.data : event.target.value;
    const typed = raw.replace(ACCEPT[type], '');
    if (typed === '') {
      // The box was emptied: the characters after it move up.
      update(code.slice(0, index) + code.slice(index + 1));
      return;
    }
    // One character replaces the box's; a paste or an autofill fills on from it.
    update(code.slice(0, index) + typed + code.slice(index + typed.length));
    focusBoxAfterUpdate(index + typed.length);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'Backspace':
        if (index >= code.length || code[index] === undefined) {
          // Nothing in this box: take the character before it.
          event.preventDefault();
          if (index > 0) {
            update(code.slice(0, index - 1) + code.slice(index));
            focusBoxAfterUpdate(index - 1);
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusBox(index - 1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        focusBox(Math.min(index + 1, code.length));
        break;
      case 'Home':
        event.preventDefault();
        focusBox(0);
        break;
      case 'End':
        event.preventDefault();
        focusBox(Math.min(code.length, length - 1));
        break;
    }
  };

  return (
    <div className={cx(field.field, className)} style={style} data-state={dataState}>
      <div
        role="group"
        id={id ?? autoId}
        aria-label={label}
        aria-describedby={message != null ? messageId : undefined}
        className={cx(styles.row, hasError && styles.error)}
      >
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              boxes.current[index] = node;
            }}
            type="text"
            inputMode={type === 'numeric' ? 'numeric' : 'text'}
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            autoFocus={autoFocus && index === 0}
            className={cx(styles.digit, code[index] !== undefined && styles.filled)}
            value={code[index] ?? ''}
            placeholder={placeholder}
            disabled={disabled}
            aria-label={`${label} digit ${index + 1} of ${length}`}
            aria-invalid={hasError || undefined}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={(event) => {
              // Boxes fill in order: a box past the end of the code hands the focus to the next empty one.
              if (index > code.length) focusBox(code.length);
              else event.currentTarget.select();
            }}
          />
        ))}
      </div>
      {name && <input type="hidden" name={name} value={code} />}
      <FieldMessages id={messageId} helperText={helperText} error={error} link={link} onLinkClick={onLinkClick} />
    </div>
  );
}

export default CodeInput;
