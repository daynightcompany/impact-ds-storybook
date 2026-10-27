import { createContext, isValidElement, useId } from 'react';
import type { MouseEvent, ReactNode, RefObject } from 'react';
import styles from './Field.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** True inside a Text input group: the fields lose their own stroke. */
export const FieldGroupContext = createContext(false);

/** Props of the helper text, the error message and the link under a field. */
export interface FieldMessageProps {
  /**
   * Figma boolean "Helper text". `true` shows the default text ("Helper text",
   * or "Error message" while `error` is set); pass a node to write your own.
   */
  helperText?: boolean | ReactNode;
  /**
   * Error state: a red stroke and a red helper text. A node replaces the helper
   * text with that error message; `true` keeps the helper text.
   */
  error?: boolean | ReactNode;
  /**
   * Figma boolean "Link". `true` shows a link that says "Link", a string is its
   * text, an element (`<a href>`) replaces it.
   */
  link?: boolean | ReactNode;
  /** Called by the default link button. */
  onLinkClick?: () => void;
}

/** What the helper line says (or null) and whether the field is in error. */
export function resolveFieldMessage({ helperText, error }: Pick<FieldMessageProps, 'helperText' | 'error'>): {
  message: ReactNode;
  hasError: boolean;
} {
  const hasError = error !== false && error !== null && error !== undefined;
  // An error message of your own replaces the helper text.
  if (hasError && error !== true) return { message: error, hasError };
  if (helperText === true) return { message: hasError ? 'Error message' : 'Helper text', hasError };
  if (helperText === false || helperText === null || helperText === undefined) return { message: null, hasError };
  return { message: helperText, hasError };
}

/** An id for the helper text, so the control can point `aria-describedby` at it. */
export function useFieldMessageId(): string {
  return useId();
}

/** The helper text (or error message) and the link under a field. */
export function FieldMessages({
  id,
  helperText,
  error,
  link,
  onLinkClick,
}: FieldMessageProps & { id?: string }) {
  const { message, hasError } = resolveFieldMessage({ helperText, error });
  const showLink = link !== false && link !== null && link !== undefined;

  return (
    <>
      {message != null && (
        <div id={id} className={[styles.helper, hasError && styles.helperError].filter(Boolean).join(' ')} aria-live="polite">
          {message}
        </div>
      )}
      {showLink && (
        <div className={styles.link}>
          {isValidElement(link) ? (
            link
          ) : (
            <button type="button" onClick={onLinkClick}>
              {link === true ? 'Link' : link}
            </button>
          )}
        </div>
      )}
    </>
  );
}

/**
 * Pressing the padding of a field's box focuses its control, like pressing
 * a label would. Buttons, links and the control itself keep their own behaviour.
 */
export function focusControlOnBoxPress(controlRef: RefObject<HTMLElement | null>) {
  return (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select')) return;
    event.preventDefault();
    controlRef.current?.focus();
  };
}

/** Joins class names, dropping the falsy ones. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
