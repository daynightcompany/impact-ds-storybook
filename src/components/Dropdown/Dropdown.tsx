import { useContext, useId } from 'react';
import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import styles from '../Field/Field.module.css';
import {
  FieldGroupContext,
  FieldMessages,
  cx,
  resolveFieldMessage,
  type FieldMessageProps,
} from '../Field/FieldParts';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface DropdownProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'children'>,
    FieldMessageProps {
  /**
   * The label. While nothing is selected it is the placeholder (half opacity);
   * once there is a value it becomes the small caption above the value.
   */
  label?: string;
  /** The selected value. The field is Populated when there is one. */
  value?: ReactNode;
  /** Figma boolean "Icon": a 24px icon at the start. `true` shows the placeholder icon; pass a node to use your own. */
  icon?: boolean | ReactNode;
  /** Figma boolean "Chevron" (on in the Figma Dropdown). */
  chevron?: boolean;
  /** Figma boolean "Required": shows the "Required" text at the end. */
  required?: boolean;
  /** The text of the Required boolean. */
  requiredLabel?: string;
  /**
   * The popup the dropdown controls is open: the field takes its Focused look
   * and `aria-expanded` is set.
   */
  open?: boolean;
  /** Shows the Hover or Focused look without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
  ref?: Ref<HTMLButtonElement>;
}

/**
 * Impact DS Dropdown — converted from the Figma "Dropdown" component set
 * (node 9587:5298), the "Base/Input Field" box with a chevron that opens a
 * popup. It is a button: pressing it asks the popup to open (`onClick`), and
 * `open` shows the Focused state while the popup is open. Pair it with a
 * <Popup> (see the stories "Open" and "Interactive", and the Popup story
 * "Dropdown with a popup").
 *
 * The label is the placeholder while nothing is selected, a small caption
 * above the selected `value` afterwards. The Figma booleans are props (`icon`,
 * `chevron`, `required`, `link`, `helperText`); `error` and `disabled` set the
 * Error and Disabled states, Hover and Focused are the browser's own.
 * `className` / `style` apply to the field as a whole, a `ref` to the button.
 */
export function Dropdown({
  label = 'Label',
  value,
  icon = false,
  chevron = true,
  required,
  requiredLabel = 'Required',
  open,
  helperText,
  error,
  link,
  onLinkClick,
  className,
  style,
  disabled,
  type = 'button',
  ref,
  'aria-describedby': describedBy,
  'data-state': dataState,
  ...rest
}: DropdownProps) {
  const grouped = useContext(FieldGroupContext);
  const messageId = useId();
  const { message, hasError } = resolveFieldMessage({ helperText, error });
  const filled = value !== undefined && value !== null && value !== false && value !== '';

  return (
    <div className={cx(styles.field, grouped && styles.grouped, className)} style={style} data-state={dataState}>
      <button
        aria-haspopup="dialog"
        {...rest}
        ref={ref}
        type={type}
        disabled={disabled}
        aria-expanded={open}
        aria-describedby={cx(message != null && messageId, describedBy) || undefined}
        data-open={open ? 'true' : undefined}
        className={cx(
          styles.box,
          styles.pointer,
          styles.tint,
          filled && styles.filled,
          hasError && styles.error,
          disabled && styles.disabled,
        )}
      >
        <span className={styles.flag}>
          {icon !== false && icon !== null && icon !== undefined && (
            <span className={styles.icon}>{icon === true ? <Icon /> : icon}</span>
          )}
          <span className={styles.content}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value} aria-hidden={filled ? undefined : true}>
              {filled ? value : label}
            </span>
          </span>
        </span>
        {(required || chevron) && (
          <span className={styles.trailing}>
            {required && <span className={styles.required}>{requiredLabel}</span>}
            {chevron && (
              <span className={styles.chevron}>
                <Icon name="chevron-down" />
              </span>
            )}
          </span>
        )}
      </button>
      <FieldMessages id={messageId} helperText={helperText} error={error} link={link} onLinkClick={onLinkClick} />
    </div>
  );
}

export default Dropdown;
