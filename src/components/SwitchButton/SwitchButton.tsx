import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './SwitchButton.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Primary = 40px tall with 8px corners and S items, Secondary = 48px, rounded, M items. */
export type SwitchButtonType = 'Primary' | 'Secondary';

export interface SwitchButtonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'children'> {
  type?: SwitchButtonType;
  /** The left item, active while the switch is off. Text or an icon. */
  offLabel?: ReactNode;
  /** The right item, active while the switch is on. Text or an icon. */
  onLabel?: ReactNode;
}

/**
 * Impact DS Switch button — converted from the Figma "Switch Button"
 * component set (node 9587:3589), built on "Base/SwitchButton" 9587:3563. Type
 * Primary / Secondary x State Off / On, with the two items in the Items slot.
 *
 * A two-item switch: a white thumb sits on the left item while it is Off (grey
 * track) and slides to the right item when it is On (green track, the left
 * label turns light). Both items are the same width, set by the wider label.
 *
 * Same accessible pattern as Switch: a real, visually hidden native
 * <input type="checkbox" role="switch"> drives every visual state. Give it an
 * `aria-label`, since the two item labels alone do not name the setting.
 * Figma has no hover or disabled state: hover fills the inactive item like a
 * Tab/Secondary and disabled fades the control to 30%.
 */
export function SwitchButton({
  type = 'Primary',
  offLabel = 'Off',
  onLabel = 'On',
  className,
  ...rest
}: SwitchButtonProps) {
  return (
    <label className={[styles.root, className].filter(Boolean).join(' ')}>
      <input type="checkbox" role="switch" className={styles.input} {...rest} />
      <span className={[styles.track, styles[type.toLowerCase()]].join(' ')}>
        <span className={styles.thumb} aria-hidden="true" />
        <span className={[styles.item, styles.itemOff].join(' ')}>{offLabel}</span>
        <span className={[styles.item, styles.itemOn].join(' ')}>{onLabel}</span>
      </span>
    </label>
  );
}

export default SwitchButton;
