import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Progress.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface ProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** How far along it is, in percent from 0 to 100 (Figma `%`: 0, 25, 50, 75, 100). */
  value?: number;
  /**
   * Fills the bar to 100% over this many milliseconds, in a straight line,
   * from the 5px start of the Figma "Progress animation" (frame `%=0`).
   * `value` is ignored. Give the bar a new `key` to run it again.
   */
  duration?: number;
  /** Holds a running animation where it is. */
  paused?: boolean;
  /** Called when an animation reaches 100%. */
  onComplete?: () => void;
}

/**
 * Impact DS Progress — converted from the Figma "Progress" and "Progress
 * animation" component sets (nodes 9587:6046 and 9587:6068 in the SMAL Impact
 * Design System (Public) Figma file). A 4px bar that fills the width of its
 * container: a track in border/tertiary and a fill in interactive/idle/primary,
 * both with round ends.
 */
export function Progress({
  value = 0,
  duration,
  paused = false,
  onComplete,
  className,
  style,
  ...rest
}: ProgressProps) {
  const animated = duration !== undefined;
  const percent = Math.min(100, Math.max(0, value));
  const fillStyle: CSSProperties = animated
    ? { animationDuration: `${duration}ms` }
    : { width: `${percent}%` };

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={animated ? undefined : Math.round(percent)}
      className={[styles.progress, animated ? styles.animated : '', paused ? styles.paused : '', className]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...rest}
    >
      <span className={styles.fill} style={fillStyle} onAnimationEnd={animated ? onComplete : undefined} />
    </div>
  );
}

export default Progress;
