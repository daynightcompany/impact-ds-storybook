import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Carousel.module.css';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
import { ProductCard } from '../ProductCard/ProductCard';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CarouselProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /**
   * Figma slot "children": the items, laid out in one row that scrolls
   * sideways. Each direct child is one slide. Figma shows seven small product
   * cards, which is what you get without it.
   */
  children?: ReactNode;
  /** The name of the carousel for assistive technology, e.g. "Featured products". */
  label?: string;
  /** The name of the button that goes back. */
  previousLabel?: string;
  /** The name of the button that goes on. */
  nextLabel?: string;
}

/** True when the visitor asked for less motion. */
function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/**
 * Impact DS Carousel — converted from the Figma "Card/Carousel" component
 * (node 9587:7714 in the SMAL Impact Design System (Public) Figma file): a row
 * of items, spacing/xs apart, that clips what does not fit, with two round
 * Primary icon buttons (arrow left and arrow right, spacing/3xs apart) under
 * it on the right. Here the row scrolls: the buttons move it by a page, one
 * item at a time landing at the start (smoothly, or at once with reduced
 * motion), and each is disabled when there is nowhere left to go; touch and
 * trackpad scroll it as well, and the arrow keys when it has focus. The
 * spacing and the button size follow the breakpoint tokens, so Mobile is
 * smaller.
 *
 * The row is one labelled region that can be focused. Use `label` to name it.
 */
export function Carousel({
  children,
  label = 'Carousel',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
  ...rest
}: CarouselProps) {
  const trackId = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  // Nothing to scroll until it is measured: both buttons start disabled.
  const [edges, setEdges] = useState({ atStart: true, atEnd: true });

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
    setEdges((current) => (current.atStart === atStart && current.atEnd === atEnd ? current : { atStart, atEnd }));
  }, []);

  // The items can change on every render, so look again after each one.
  useLayoutEffect(measure);
  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    for (const item of Array.from(track.children)) observer.observe(item);
    return () => observer.disconnect();
  });

  const scrollPage = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const items = Array.from(track.children) as HTMLElement[];
    const left = track.scrollLeft;
    const right = left + track.clientWidth;
    let target: number;
    if (direction === 1) {
      // The first item that is not fully in view comes to the start.
      const next = items.find((item) => item.offsetLeft + item.offsetWidth > right + 1);
      target = next ? next.offsetLeft : track.scrollWidth;
    } else {
      // The page before: the items that were cut off at the start come back into view.
      const before = items.filter((item) => item.offsetLeft < left - 1);
      const reach = left - track.clientWidth;
      const previous = before.find((item) => item.offsetLeft >= reach - 1) ?? before[0];
      target = previous ? previous.offsetLeft : 0;
    }
    track.scrollTo({ left: target, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };

  const classes = [styles.carousel, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <div
        id={trackId}
        ref={trackRef}
        className={styles.track}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        tabIndex={0}
        onScroll={measure}
      >
        {children ?? Array.from({ length: 7 }, (_, index) => <ProductCard key={index} size="S" />)}
      </div>
      <div className={styles.header}>
        <div className={styles.controls}>
          <Button
            hierarchy="Primary"
            size="L"
            icon="Only"
            iconElement={<Icon name="arrow-left" />}
            aria-label={previousLabel}
            aria-controls={trackId}
            disabled={edges.atStart}
            onClick={() => scrollPage(-1)}
          />
          <Button
            hierarchy="Primary"
            size="L"
            icon="Only"
            iconElement={<Icon name="arrow-right" />}
            aria-label={nextLabel}
            aria-controls={trackId}
            disabled={edges.atEnd}
            onClick={() => scrollPage(1)}
          />
        </div>
      </div>
    </div>
  );
}

export default Carousel;
