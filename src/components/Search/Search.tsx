import { useId, useImperativeHandle, useRef } from 'react';
import type { ComponentPropsWithRef, KeyboardEvent } from 'react';
import styles from './Search.module.css';
import field from '../Field/Field.module.css';
import { cx, focusControlOnBoxPress } from '../Field/FieldParts';
import { Icon } from '../Icon';
import { Label, type LabelTone } from '../Label/Label';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** A value shown as a pill in front of the text (Figma "Populated multi"). */
export interface SearchTag {
  /** Key and identity of the tag; the label when left out. */
  id?: string;
  label: string;
  /** The Label tone (purple by default; the second tag in Figma is orange). */
  tone?: LabelTone;
}

export interface SearchProps extends Omit<ComponentPropsWithRef<'input'>, 'size' | 'prefix' | 'type'> {
  /** The accessible name of the field (Figma has no visible caption). */
  label?: string;
  /** Figma boolean "Icon": the search icon at the start. */
  icon?: boolean;
  /**
   * Figma boolean "Chevron" (the clear icon in the Search set): a clear button
   * at the end, shown while there is text or a tag.
   */
  clear?: boolean;
  /** Called by the clear button, after it has emptied the text. Clear your tags here. */
  onClear?: () => void;
  /** The accessible name of the clear button. */
  clearLabel?: string;
  /** Figma "Populated multi": pills in front of the text. */
  tags?: SearchTag[];
  /** Called by a tag's remove button, and by Backspace in an empty field (the last tag). */
  onTagRemove?: (tag: SearchTag, index: number) => void;
  /** The accessible name of a tag's remove button. */
  tagRemoveLabel?: (tag: SearchTag) => string;
  /** Shows the Hover or Focused look without the pointer or the focus, for documentation and visual tests. */
  'data-state'?: 'hover' | 'focus';
}

/** Empties an input the way typing would, so React's onChange sees it. */
function emptyInput(input: HTMLInputElement) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
  setter?.call(input, '');
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

/**
 * Impact DS Search — converted from the Figma "Search" component set
 * (node 9587:5505): the Base/Input Field box with a search icon, the text and a
 * clear button. The Figma booleans are props (`icon`, `clear`); Idle, Hover,
 * Focused and Disabled are the browser's own states; Empty and Populated follow
 * the text. "Populated multi" is `tags`: pills (the Label component, Size S) in
 * front of the text, each with a remove button; the box grows when they wrap.
 *
 * It takes the props of an `<input>` (`value`, `defaultValue`, `onChange`,
 * `placeholder`, `disabled`, ...), a `ref` to it, and `className` / `style` for
 * the field as a whole. Pressing Enter submits the surrounding form, as for any
 * input; type `search` is not used so the browser draws no clear icon of its own.
 */
export function Search({
  label = 'Search',
  icon = true,
  clear = true,
  onClear,
  clearLabel = 'Clear',
  tags = [],
  onTagRemove,
  tagRemoveLabel = (tag) => `Remove ${tag.label}`,
  className,
  style,
  disabled,
  placeholder,
  id,
  ref,
  onKeyDown,
  'data-state': dataState,
  ...rest
}: SearchProps) {
  const autoId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

  const hasTags = tags.length > 0;
  // The browser needs a placeholder to tell an empty field from one with text;
  // with tags in front, the placeholder is blank.
  const placeholderText = hasTags ? ' ' : placeholder === '' ? ' ' : (placeholder ?? label);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === 'Backspace' && hasTags && event.currentTarget.value === '') {
      onTagRemove?.(tags[tags.length - 1], tags.length - 1);
    }
  };

  return (
    <div
      className={cx(field.field, styles.search, hasTags && styles.tagged, className)}
      style={style}
      data-state={dataState}
    >
      <div
        className={cx(field.box, field.noLabel, hasTags && field.filled, hasTags && field.tagged, disabled && field.disabled)}
        onMouseDown={focusControlOnBoxPress(inputRef)}
      >
        <div className={field.flag}>
          {icon && (
            <span className={field.icon}>
              <Icon name="search" />
            </span>
          )}
          <div className={styles.items}>
            {tags.map((tag, index) => (
              <Label
                key={tag.id ?? tag.label}
                size="S"
                tone={tag.tone ?? 'purple'}
                icon
                iconElement={
                  <button
                    type="button"
                    className={styles.remove}
                    aria-label={tagRemoveLabel(tag)}
                    disabled={disabled}
                    onClick={() => onTagRemove?.(tag, index)}
                  >
                    <Icon name="x" />
                  </button>
                }
              >
                {tag.label}
              </Label>
            ))}
            <input
              {...rest}
              ref={inputRef}
              id={id ?? autoId}
              type="text"
              className={cx(field.control, styles.input)}
              placeholder={placeholderText}
              disabled={disabled}
              aria-label={label}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        {clear && !disabled && (
          <span className={styles.clearSlot}>
            <button
              type="button"
              className={styles.clear}
              aria-label={clearLabel}
              onClick={() => {
                const input = inputRef.current;
                if (input) {
                  emptyInput(input);
                  input.focus();
                }
                onClear?.();
              }}
            >
              <Icon name="x" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

export default Search;
