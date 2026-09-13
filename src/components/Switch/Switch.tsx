import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Switch.module.css';
import '../../styles/tokens.css';

export type SwitchSize = 'S' | 'M' | 'L';

type BaseProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>;

/**
 * `icon` is only a real Figma variant at Size=L ("With icon" pair,
 * nodes 9701:25432 / 9701:25439) — S/M have no icon variant, so the
 * prop is typed out for them rather than silently ignored at runtime.
 */
export type SwitchProps = BaseProps &
  ({ size?: 'S' | 'M'; icon?: never } | { size: 'L'; icon?: ReactNode });

/**
 * Impact DS Switch — from the Figma "Switch" component set (node
 * 3304:9342): S/M/L x On/Off (6 variants), plus an L-only "With icon"
 * pair that swaps the track's success-green fill for a neutral/primary
 * pair and swaps the icon/knob sides instead of sliding a single knob
 * across an empty track.
 *
 * Same accessible pattern as Checkbox/Radiobutton: a real, visually
 * hidden native <input type="checkbox"> (role="switch" for correct
 * screen-reader semantics) drives every visual state via CSS.
 *
 * No hover variant exists in Figma for Switch, Checkbox, or
 * Radiobutton — the hover treatment here follows the same convention
 * those two already use, not a confirmed Figma value.
 */
export function Switch({ size = 'S', icon, className, ...rest }: SwitchProps) {
  const withIcon = size === 'L' && icon != null;
  return (
    <label className={[styles.root, className].filter(Boolean).join(' ')}>
      <input type="checkbox" role="switch" className={styles.input} {...rest} />
      <span
        className={[styles.track, styles[`size-${size.toLowerCase()}`], withIcon && styles.withIcon]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        {withIcon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.knob} />
      </span>
    </label>
  );
}

export default Switch;
