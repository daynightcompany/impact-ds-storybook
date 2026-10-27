import { useCallback, useContext, useEffect, useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import type { ComponentPropsWithRef } from 'react';
import styles from '../Field/Field.module.css';
import {
  FieldGroupContext,
  FieldMessages,
  cx,
  focusControlOnBoxPress,
  resolveFieldMessage,
  type FieldMessageProps,
} from '../Field/FieldParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface InputFieldAreaProps
  extends Omit<ComponentPropsWithRef<'textarea'>, 'cols'>,
    Pick<FieldMessageProps, 'helperText' | 'error' | 'link' | 'onLinkClick'> {
  /**
   * The label. While the field is empty it is the placeholder (half opacity);
   * once there is text it becomes the small caption above it.
   */
  label?: string;
  /**
   * The most lines the field grows to before it scrolls. Figma has no limit,
   * so by default the field grows with its text.
   */
  maxRows?: number;
  /** Shows the Hover or Focused look without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
}

/**
 * Impact DS Input field area — converted from the Figma "Input field area"
 * component set (node 9587:5270): the Base/Input Field box for several lines of
 * text. The 56px box (one line) grows with the text, 24px a line, with the label
 * above the text and the helper text under the box. Idle, Hover, Focused and
 * Disabled are the browser's own states; `error` sets Error; Empty and Populated
 * follow the text. `rows` sets the least number of lines (1 by default).
 *
 * It takes the props of a `<textarea>`, a `ref` to it, and `className` /
 * `style` for the field as a whole.
 */
export function InputFieldArea({
  label = 'Label',
  rows = 1,
  maxRows,
  helperText,
  error,
  link,
  onLinkClick,
  className,
  style,
  disabled,
  placeholder,
  id,
  ref,
  onInput,
  'aria-describedby': describedBy,
  'data-state': dataState,
  ...rest
}: InputFieldAreaProps) {
  const grouped = useContext(FieldGroupContext);
  const autoId = useId();
  const messageId = useId();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => areaRef.current as HTMLTextAreaElement);

  const inputId = id ?? autoId;
  const { message, hasError } = resolveFieldMessage({ helperText, error });
  // The browser needs a placeholder to tell an empty field from one with text.
  const placeholderText = placeholder === '' ? ' ' : (placeholder ?? label);

  // The box is as high as its text: reset, then take the scroll height.
  const grow = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    area.style.height = 'auto';
    const lineHeight = parseFloat(getComputedStyle(area).lineHeight) || 24;
    const limit = maxRows ? lineHeight * maxRows : Infinity;
    area.style.height = `${Math.min(area.scrollHeight, limit)}px`;
    area.style.overflowY = area.scrollHeight > limit ? 'auto' : 'hidden';
  }, [maxRows]);

  // After every render (a controlled value changes the text without an input event).
  useLayoutEffect(grow);

  // A change of width wraps the lines differently.
  useEffect(() => {
    const area = areaRef.current;
    if (!area || typeof ResizeObserver === 'undefined') return;
    let width = area.clientWidth;
    const observer = new ResizeObserver(() => {
      if (area.clientWidth !== width) {
        width = area.clientWidth;
        grow();
      }
    });
    observer.observe(area);
    return () => observer.disconnect();
  }, [grow]);

  return (
    <div className={cx(styles.field, grouped && styles.grouped, className)} style={style} data-state={dataState}>
      <div
        className={cx(styles.box, hasError && styles.error, disabled && styles.disabled)}
        onMouseDown={focusControlOnBoxPress(areaRef)}
      >
        <div className={styles.flag}>
          <div className={styles.content}>
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
            <textarea
              {...rest}
              ref={areaRef}
              id={inputId}
              rows={rows}
              className={styles.control}
              placeholder={placeholderText}
              disabled={disabled}
              aria-invalid={hasError || undefined}
              aria-describedby={cx(message != null && messageId, describedBy) || undefined}
              onInput={(event) => {
                grow();
                onInput?.(event);
              }}
            />
          </div>
        </div>
      </div>
      <FieldMessages id={messageId} helperText={helperText} error={error} link={link} onLinkClick={onLinkClick} />
    </div>
  );
}

export default InputFieldArea;
