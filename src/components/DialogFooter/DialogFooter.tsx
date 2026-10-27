import { isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './DialogFooter.module.css';
import { Button, type ButtonHierarchy } from '../Button/Button';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma "Button width": how many buttons the footer is built for. */
export type DialogFooterButtonWidth = '3 CTA' | '2 CTA';
/** Figma "Layout": buttons side by side (they wrap when narrow) or stacked. */
export type DialogFooterLayout = 'Horizontal' | 'Vertical';

/**
 * A footer button slot. `true` shows the default button, a string is its label,
 * any node replaces it (give it `size="L"` so it matches), `false` hides it.
 */
export type DialogFooterButton = boolean | ReactNode;

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma "Button width". `3 CTA` is the wide footer (Tertiary at the start,
   * Secondary and Primary at the end); `2 CTA` is Secondary and Primary only,
   * so the Tertiary button is never shown.
   */
  buttonWidth?: DialogFooterButtonWidth;
  layout?: DialogFooterLayout;
  /** Figma boolean "Primary button". */
  primaryButton?: DialogFooterButton;
  /** Figma boolean "Secondary button". */
  secondaryButton?: DialogFooterButton;
  /** Figma boolean "Tertiary button" (`3 CTA` only). */
  tertiaryButton?: DialogFooterButton;
}

function renderButton(value: DialogFooterButton, hierarchy: ButtonHierarchy): ReactNode {
  if (value === false || value === null || value === undefined) return null;
  if (value === true) return <Button hierarchy={hierarchy} size="L" />;
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Button hierarchy={hierarchy} size="L">
        {value}
      </Button>
    );
  }
  return isValidElement(value) ? value : <>{value}</>;
}

/**
 * Impact DS Dialog footer — converted from the Figma "Dialog/Footer"
 * component set (node 9587:6837): Button width (3 CTA / 2 CTA) x Layout
 * (Horizontal / Vertical) with the booleans Primary, Secondary and Tertiary
 * button. Figma has three of the four combinations; 2 CTA / Vertical is the
 * same stack of two.
 *
 * Spacing: 3 CTA Horizontal pads 16px (spacing/s); the others pad spacing/l
 * (32px, 24px on Mobile). In 2 CTA and Vertical the buttons share the width
 * and are at least 176px wide, so two of them wrap into a stack in a narrow
 * dialog, exactly like the Figma auto layout. Inside a Dialog or Popup the
 * instance padding is overridden, here through `--dialog-footer-padding`.
 */
export function DialogFooter({
  buttonWidth = '3 CTA',
  layout = 'Horizontal',
  primaryButton = true,
  secondaryButton = true,
  tertiaryButton = true,
  className,
  ...rest
}: DialogFooterProps) {
  const wide = buttonWidth === '3 CTA' && layout === 'Horizontal';
  const stacked = layout === 'Vertical';
  const classes = [
    styles.footer,
    wide ? styles.wide : styles.fill,
    stacked && styles.stacked,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const tertiary = buttonWidth === '3 CTA' ? renderButton(tertiaryButton, 'Tertiary') : null;
  const secondary = renderButton(secondaryButton, 'Secondary');
  const primary = renderButton(primaryButton, 'Primary');

  return (
    <div className={classes} {...rest}>
      <div className={styles.buttons}>
        {tertiary && <div className={styles.slot}>{tertiary}</div>}
        <div className={styles.group}>
          {secondary && <div className={styles.slot}>{secondary}</div>}
          {primary && <div className={styles.slot}>{primary}</div>}
        </div>
      </div>
    </div>
  );
}

export default DialogFooter;
