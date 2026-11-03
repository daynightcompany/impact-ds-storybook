import type { HTMLAttributes } from 'react';
import styles from './Loader.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma `Size`: M is 24px, L is 48px. */
export type LoaderSize = 'M' | 'L';

export interface LoaderProps extends HTMLAttributes<HTMLSpanElement> {
  size?: LoaderSize;
}

/** Centre-line radius of the ring in a box of the size: Figma draws the ellipse 4px inside the box (M) or 8px (L). */
const RADIUS: Record<LoaderSize, number> = { M: 10, L: 20 };
const BOX: Record<LoaderSize, number> = { M: 24, L: 48 };

/**
 * Impact DS Loader — converted from the Figma "Loader" component set (node
 * 9587:6032 in the SMAL Impact Design System (Public) Figma file).
 * A ring with a third of it drawn in the dark color (round ends); here it
 * turns, which the static Figma frames can't show. It is an indeterminate
 * progress bar for assistive tech: change the `aria-label` to say what is
 * loading.
 */
export function Loader({ size = 'M', className, ...rest }: LoaderProps) {
  const box = BOX[size];
  const c = box / 2;
  const r = RADIUS[size];
  return (
    <span
      role="progressbar"
      aria-label="Loading"
      className={[styles.loader, styles[`size-${size.toLowerCase()}`], className].filter(Boolean).join(' ')}
      {...rest}
    >
      <svg className={styles.svg} viewBox={`0 0 ${box} ${box}`} fill="none" aria-hidden>
        <circle className={styles.track} cx={c} cy={c} r={r} />
        {/* pathLength 360 makes the dash a number of degrees: a 120 degree arc that starts at 12 o'clock */}
        <circle
          className={styles.arc}
          cx={c}
          cy={c}
          r={r}
          pathLength={360}
          transform={`rotate(-90 ${c} ${c})`}
        />
      </svg>
    </span>
  );
}

export default Loader;
