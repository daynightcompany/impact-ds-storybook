import { useState } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './SlideTimer.module.css';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface SlideTimerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** The current slide, counted from 1 (Figma `Slide`). */
  slide?: number;
  /** How many slides there are (Figma draws four). */
  count?: number;
  /** How long the current slide stays, in milliseconds: the time its bar takes to fill. */
  duration?: number;
  /** Holds the bar where it is. Figma's frames show the start of a slide, so `paused` on a fresh slide matches them. */
  paused?: boolean;
  /** Figma `Show Slider`: the previous and next arrows. */
  showSlider?: boolean;
  /** The bar filled up, or an arrow was pressed. Asked for the slide to show next (after the last comes the first). */
  onSlideChange?: (slide: number) => void;
  previousLabel?: string;
  nextLabel?: string;
}

/**
 * Impact DS Slide timer — converted from the Figma "Slide timer" component
 * set (node 9587:6174 in the SMAL Impact Design System (Public) Figma file).
 * One bar per slide. Every bar is inactive (a track in border/tertiary); only
 * the progress is active: the current slide's bar is wider and its fill
 * (interactive/idle/primary) grows over `duration`. When the slide changes the
 * bars glide to their new widths and the fill that was running fades out where
 * it stopped, ease out over 300ms. The arrows are Tertiary icon buttons. It
 * controls nothing itself: show the slide that `onSlideChange` asks for, with
 * the same `slide` prop.
 */
export function SlideTimer({
  slide = 1,
  count = 4,
  duration = 5000,
  paused = false,
  showSlider = true,
  onSlideChange,
  previousLabel = 'Previous slide',
  nextLabel = 'Next slide',
  className,
  ...rest
}: SlideTimerProps) {
  const total = Math.max(1, Math.round(count));
  const current = Math.min(Math.max(1, Math.round(slide)), total);
  const next = current === total ? 1 : current + 1;
  const previous = current === 1 ? total : current - 1;

  // The bar that was current a moment ago keeps its fill, which fades out where it
  // stopped (`leaving`), and a bar that becomes current again starts a fresh fill (`runs`
  // counts how often each bar has been the current one, and keys its fill).
  const [seen, setSeen] = useState(current);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [runs, setRuns] = useState<Record<number, number>>({ [current]: 1 });
  if (seen !== current) {
    setSeen(current);
    setLeaving(seen);
    setRuns({ ...runs, [current]: (runs[current] ?? 0) + 1 });
  }

  return (
    <div
      role="group"
      aria-label={`Slide ${current} of ${total}`}
      className={[styles.timer, className].filter(Boolean).join(' ')}
      {...rest}
    >
      <div className={styles.bars} data-paused={paused ? '' : undefined} aria-hidden>
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
          const isCurrent = n === current;
          return (
            <span
              key={n}
              className={styles.bar}
              data-current={isCurrent ? '' : undefined}
              data-leaving={!isCurrent && n === leaving ? '' : undefined}
            >
              <span
                key={`${n}-${runs[n] ?? 0}`}
                className={styles.fill}
                style={{ '--slide-duration': `${duration}ms` } as CSSProperties}
                onAnimationEnd={isCurrent ? () => onSlideChange?.(next) : undefined}
              />
            </span>
          );
        })}
      </div>
      {showSlider && (
        <div className={styles.slider}>
          <Button
            hierarchy="Tertiary"
            size="L"
            icon="Only"
            iconElement={<Icon name="chevron-left" />}
            aria-label={previousLabel}
            onClick={() => onSlideChange?.(previous)}
          />
          <Button
            hierarchy="Tertiary"
            size="L"
            icon="Only"
            iconElement={<Icon name="chevron-right" />}
            aria-label={nextLabel}
            onClick={() => onSlideChange?.(next)}
          />
        </div>
      )}
    </div>
  );
}

export default SlideTimer;
