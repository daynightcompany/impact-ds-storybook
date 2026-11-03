import { useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './FloatingToolbar.module.css';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface FloatingToolbarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * The text before the items (Figma `Label`, "Label"). Figma draws only the
   * labelled toolbar; without a label the side padding is the same as above
   * and below. It also names the toolbar for assistive tech, unless
   * `aria-label` or `aria-labelledby` is given.
   */
  label?: ReactNode;
  /**
   * The items, in the order they appear: Figma uses Tertiary icon-only
   * Buttons of size L (the `Items` slot and the four placeholder buttons).
   * They sit between the label and the close button.
   */
  children?: ReactNode;
  /** Figma `Close`: the X button at the end. */
  close?: boolean;
  /** Called when the close button is pressed. */
  onClose?: () => void;
  /** The accessible name of the close button. */
  closeLabel?: string;
}

/**
 * Impact DS Floating toolbar — converted from the Figma "Floating toolbar"
 * component set (node 9587:6245 in the SMAL Impact Design System (Public)
 * Figma file). A pill of actions that floats above the page: a label, the
 * items and a close button on the page background, with the large shadow
 * (shadow/l). Every item stays in the tab order.
 */
export function FloatingToolbar({
  label,
  children,
  close = true,
  onClose,
  closeLabel = 'Close',
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...rest
}: FloatingToolbarProps) {
  const labelId = useId();
  const hasLabel = label !== undefined && label !== null && label !== false && label !== '';
  const labelledBy = ariaLabelledBy ?? (hasLabel && ariaLabel === undefined ? labelId : undefined);

  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      aria-labelledby={labelledBy}
      className={[styles.toolbar, hasLabel ? styles.labelled : '', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {hasLabel && (
        <span id={labelId} className={styles.label}>
          {label}
        </span>
      )}
      {children}
      {close && (
        <Button
          type="button"
          hierarchy="Tertiary"
          size="L"
          icon="Only"
          iconElement={<Icon name="x" size={24} />}
          aria-label={closeLabel}
          onClick={onClose}
        />
      )}
    </div>
  );
}

export default FloatingToolbar;
