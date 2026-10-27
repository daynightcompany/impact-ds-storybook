import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Chip.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * Figma size ladder (Desktop height): M = 40px, XL = 64px (48px on Mobile).
 * Mobile values come from the breakpoint tokens, not from a prop.
 */
export type ChipSize = 'M' | 'XL';
/**
 * Icon layouts of the Figma "Chips" set:
 * - `False`          label only
 * - `Leading`        icon + label
 * - `Trailing`       label + icon
 * - `Only`           icon only (give it an `aria-label`)
 * - `Both`           icon + label + close
 * - `Trailing Close` label + close
 * - `Only 2`         icon + close (give it an `aria-label`)
 * The three close layouts render a second, separate button for the close
 * icon (`onClose`), so the chip never nests one button inside another.
 */
export type ChipIcon =
  | 'False'
  | 'Leading'
  | 'Trailing'
  | 'Only'
  | 'Both'
  | 'Trailing Close'
  | 'Only 2';

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size' | 'children'> {
  size?: ChipSize;
  icon?: ChipIcon;
  /** Figma Condition. When set, the chip is a toggle button (`aria-pressed`). */
  selected?: boolean;
  /** Replaces the placeholder icon of the Leading / Trailing / Only layouts. */
  iconElement?: ReactNode;
  /** Close layouts only: called when the close icon is pressed. */
  onClose?: () => void;
  /** Close layouts only: accessible name of the close button. */
  closeLabel?: string;
  children?: ReactNode;
}

const hasClose = (icon: ChipIcon) => icon === 'Both' || icon === 'Trailing Close' || icon === 'Only 2';

/**
 * Impact DS Chip — converted from the Figma "Chips" component set (node
 * 9587:3985, built on "Base/Chip" 9587:3893) in the SMAL Impact Design System
 * file. 2 sizes x 7 icon layouts x Unselected/Selected x idle/hover/disabled.
 *
 * Unselected is a text-only pill that fills on hover (like the Tertiary
 * button); Selected is a filled pill with a ring. Disabled looks the same
 * selected or not: an outlined pill at 30% opacity, exactly as in Figma.
 * Hover is CSS, Disabled is the native `disabled` attribute.
 */
export function Chip({
  size = 'M',
  icon = 'False',
  selected,
  iconElement,
  onClose,
  closeLabel = 'Remove',
  children = 'Chip',
  className,
  disabled,
  ...rest
}: ChipProps) {
  const leading = icon === 'Leading' || icon === 'Both' || icon === 'Only' || icon === 'Only 2';
  const trailing = icon === 'Trailing';
  const showLabel = icon !== 'Only' && icon !== 'Only 2';
  const closable = hasClose(icon);

  const classes = [
    styles.chip,
    styles[`size-${size.toLowerCase()}`],
    styles[`icon-${icon.toLowerCase().replace(' ', '-')}`],
    selected && styles.selected,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // The box is sized by CSS tokens (see .icon in Chip.module.css); the
  // number is only the glyph's intrinsic size before CSS applies.
  const iconSize = size === 'XL' ? 32 : 24;
  const iconNode = <span className={styles.icon}>{iconElement ?? <Icon size={iconSize} fixedStroke />}</span>;
  const content = (
    <>
      {leading && iconNode}
      {showLabel && <span className={styles.label}>{children}</span>}
      {trailing && iconNode}
    </>
  );

  if (!closable) {
    return (
      <button type="button" className={classes} disabled={disabled} aria-pressed={selected} {...rest}>
        {content}
      </button>
    );
  }

  return (
    <span className={classes}>
      <button type="button" className={styles.body} disabled={disabled} aria-pressed={selected} {...rest}>
        {content}
      </button>
      <button
        type="button"
        className={[styles.icon, styles.close].join(' ')}
        disabled={disabled}
        aria-label={closeLabel}
        onClick={onClose}
      >
        <Icon name="x" size={iconSize} fixedStroke />
      </button>
    </span>
  );
}

export default Chip;
