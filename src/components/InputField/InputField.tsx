import { useContext, useId, useImperativeHandle, useRef } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import styles from '../Field/Field.module.css';
import {
  FieldGroupContext,
  FieldMessages,
  cx,
  focusControlOnBoxPress,
  resolveFieldMessage,
  type FieldMessageProps,
} from '../Field/FieldParts';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface InputFieldProps
  extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix'>,
    FieldMessageProps {
  /**
   * The label. While the field is empty it is the placeholder (half opacity);
   * once there is a value it becomes the small caption above the value.
   */
  label?: string;
  /** Figma boolean "Icon": a 24px icon at the start. `true` shows the placeholder icon; pass a node to use your own. */
  icon?: boolean | ReactNode;
  /** Figma boolean "Chevron": a chevron at the end. */
  chevron?: boolean;
  /**
   * Figma boolean "Required": shows the "Required" text at the end and sets the
   * native `required` attribute.
   */
  required?: boolean;
  /** The text of the Required boolean; `false` marks the field `required` without any text. */
  requiredLabel?: string | false;
  /** Shows the Hover or Focused look without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
}

/**
 * Impact DS Input field — converted from the Figma "Base/Input Field" component
 * set (node 9587:4908) and its "Input field" wrapper (node 9587:5220): a 56px
 * box with a label that is the placeholder while the field is empty and a small
 * caption above the value afterwards. The Figma booleans are props: `icon`,
 * `chevron`, `required`, `link` and `helperText`; the "Left content" boolean
 * only groups the Required text and the chevron, so it is not a prop.
 *
 * Figma's State variants are the browser's own states here: Idle, Hover, Focused
 * and Disabled need no prop; `error` sets the Error state. Empty and Populated
 * follow the value. Controlled or not, it takes the props of an `<input>`
 * (`value`, `defaultValue`, `onChange`, `type`, ...), a `ref` to the input, and
 * `className` / `style` for the field as a whole.
 *
 * Inside a <TextInputGroup> the box loses its own stroke.
 */
export function InputField({
  label = 'Label',
  icon = false,
  chevron = false,
  required,
  requiredLabel = 'Required',
  helperText,
  error,
  link,
  onLinkClick,
  className,
  style,
  disabled,
  placeholder,
  id,
  type = 'text',
  ref,
  'aria-describedby': describedBy,
  'data-state': dataState,
  ...rest
}: InputFieldProps) {
  const grouped = useContext(FieldGroupContext);
  const autoId = useId();
  const messageId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const inputId = id ?? autoId;
  const { message, hasError } = resolveFieldMessage({ helperText, error });
  const showRequired = Boolean(required) && requiredLabel !== false;
  // The browser needs a placeholder to tell an empty field from one with a value.
  const placeholderText = placeholder === '' ? ' ' : (placeholder ?? label);

  return (
    <div className={cx(styles.field, grouped && styles.grouped, className)} style={style} data-state={dataState}>
      <div
        className={cx(styles.box, hasError && styles.error, disabled && styles.disabled)}
        onMouseDown={focusControlOnBoxPress(inputRef)}
      >
        <div className={styles.flag}>
          {icon !== false && icon !== null && icon !== undefined && (
            <span className={styles.icon}>{icon === true ? <Icon /> : icon}</span>
          )}
          <div className={styles.content}>
            <label htmlFor={inputId} className={styles.label}>
              {label}
            </label>
            <input
              {...rest}
              ref={inputRef}
              id={inputId}
              type={type}
              className={styles.control}
              placeholder={placeholderText}
              disabled={disabled}
              required={required}
              aria-invalid={hasError || undefined}
              aria-describedby={cx(message != null && messageId, describedBy) || undefined}
            />
          </div>
        </div>
        {(showRequired || chevron) && (
          <div className={styles.trailing}>
            {showRequired && <span className={styles.required}>{requiredLabel}</span>}
            {chevron && (
              <span className={styles.chevron}>
                <Icon name="chevron-down" />
              </span>
            )}
          </div>
        )}
      </div>
      <FieldMessages id={messageId} helperText={helperText} error={error} link={link} onLinkClick={onLinkClick} />
    </div>
  );
}

export default InputField;
