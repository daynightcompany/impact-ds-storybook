import { Children, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import styles from './GallerySlider.module.css';
import { Button } from '../Button/Button';
import { HeroImageContainer } from '../HeroImageContainer/HeroImageContainer';
import { Icon } from '../Icon';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { SimpleTextBlock } from '../SimpleTextBlock/SimpleTextBlock';
import { SlideIndicator } from '../SlideIndicator/SlideIndicator';
import { textSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type GallerySliderImage = 'Background' | 'Peeking';

export interface GallerySliderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /**
   * Figma variant "Image": how the pictures sit. `Background` fills the whole
   * frame with the current picture, with rounded corners; `Peeking` shows it
   * as a large rounded card in the middle of the frame, with the next picture
   * peeking in at the right edge.
   */
  image?: GallerySliderImage;
  /** Figma boolean "Title": the title at the top left. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  title?: TextSlot;
  /** Figma boolean "Buttons": the round buttons at the sides that go back and on. They are only there on Desktop, as in Figma. */
  buttons?: boolean;
  /**
   * Figma boolean "Slide indicator": the page marks at the bottom. `true`
   * shows the Slide indicator, a node replaces it (a `SlideTimer`, for a
   * gallery that turns by itself), `false` hides it.
   */
  slideIndicator?: boolean | ReactNode;
  /** Figma boolean "Next image peeking": with `Peeking`, the next picture shows at the right edge. Without it only the current picture shows. */
  nextImagePeeking?: boolean;
  /**
   * The pictures: each direct child is one slide (an `ImagePreview`, an `img`,
   * a `picture`, a video). Figma shows six placeholders, which is what you get
   * without it.
   */
  children?: ReactNode;
  /** The current slide, counted from 1, to control the gallery from outside. */
  page?: number;
  /** The slide to start on when the gallery controls itself, counted from 1. */
  defaultPage?: number;
  /** Called with the slide (counted from 1) it goes to. */
  onPageChange?: (page: number) => void;
  /** The name of the gallery for assistive technology. */
  label?: string;
  /** The name of the button that goes back. */
  previousLabel?: string;
  /** The name of the button that goes on. */
  nextLabel?: string;
}

/** Figma shows six pictures: the Slide indicator then has all its marks (the page, three dots and the small dot). */
const DEFAULT_SLIDES = Array.from({ length: 6 }, (_, index) => <ImagePreview key={index} />);

/** How far a finger or a mouse has to move sideways to turn the page. */
const SWIPE_DISTANCE = 40;

/**
 * Impact DS Gallery slider — converted from the Figma "Gallery slider"
 * component set (node 9587:7903 in the SMAL Impact Design System (Public)
 * Figma file): a frame as big as the viewport (the Figma viewport/width and
 * viewport/height variables: 1920 x 1080 on Desktop, 375 x 812 on Mobile, and
 * never higher than the window) with a gallery of pictures behind its
 * content. The content is the title at the top left, the Slide indicator at
 * the bottom in the middle and, on Desktop only, two round Tertiary buttons at
 * the sides, in the middle, that go back and on. The `image` variant says
 * how the pictures sit: `Background` fills the frame, `Peeking` shows a large
 * rounded card in the middle of the frame, on the background/primary colour,
 * with the next picture peeking in at the right edge and, after the first
 * one, the one before at the left edge. On Mobile the `Peeking` card fills
 * the frame, as in Figma, and there is no peek.
 *
 * The buttons go round at the ends. Swiping or dragging sideways and the left
 * and right arrow keys (when the gallery has focus) turn the page as well,
 * which is how Mobile, which has no buttons, goes on. The gallery is one
 * labelled region; use `label` to name it.
 */
export function GallerySlider({
  image = 'Background',
  title,
  buttons = true,
  slideIndicator = true,
  nextImagePeeking = true,
  children,
  page,
  defaultPage = 1,
  onPageChange,
  label = 'Gallery slider',
  previousLabel = 'Previous',
  nextLabel = 'Next',
  className,
  ...rest
}: GallerySliderProps) {
  const slidesId = useId();
  const layerRef = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [ownPage, setOwnPage] = useState(defaultPage);

  const slides = children == null || children === false ? DEFAULT_SLIDES : Children.toArray(children);
  const total = slides.length;
  const current = total === 0 ? 1 : Math.min(Math.max(1, Math.round(page ?? ownPage)), total);

  /** Goes to a slide, counted from 1; past the last one it is the first again, and the other way round. */
  const go = (target: number) => {
    if (total < 2) return;
    const next = ((((target - 1) % total) + total) % total) + 1;
    if (next === current) return;
    if (page === undefined) setOwnPage(next);
    onPageChange?.(next);
  };

  // A jump over several slides (from the last to the first) must not sweep along the whole row: it happens at once.
  const lastPage = useRef(current);
  useLayoutEffect(() => {
    const layer = layerRef.current;
    const from = lastPage.current;
    lastPage.current = current;
    if (!layer || Math.abs(current - from) < 2) return;
    layer.dataset.jump = '';
    layer.getBoundingClientRect();
    delete layer.dataset.jump;
  }, [current]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(current + 1);
    }
  };
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1));
  };

  const peeking = image === 'Peeking';
  const classes = [
    styles.slider,
    peeking ? styles.peeking : styles.background,
    peeking && !nextImagePeeking ? styles['no-peek'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const titleNode = textSlot(title, 'Title');
  const indicatorNode =
    slideIndicator === true ? <SlideIndicator count={Math.max(total, 1)} page={current} /> : slideIndicator;

  return (
    <div className={classes} {...rest}>
      <div
        id={slidesId}
        ref={layerRef}
        className={styles.slides}
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        aria-live="polite"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeStart.current = null;
        }}
      >
        {slides.map((slide, index) => {
          const position = index + 1;
          const isCurrent = position === current;
          const slideProps = {
            className: [styles.slide, isCurrent ? styles.current : ''].filter(Boolean).join(' '),
            role: 'group',
            'aria-roledescription': 'slide',
            'aria-label': `${position} of ${total}`,
          };
          if (peeking) {
            return (
              <HeroImageContainer
                key={index}
                {...slideProps}
                {...(isCurrent ? {} : { 'aria-hidden': true, inert: true })}
                style={{ '--offset': position - current } as CSSProperties}
                image={slide}
              />
            );
          }
          return (
            <div key={index} {...slideProps} hidden={!isCurrent}>
              {slide}
            </div>
          );
        })}
      </div>
      <div className={styles.content}>
        {titleNode != null && (
          <div className={styles.title}>
            <SimpleTextBlock size="L" eyebrow={false} subtitle={false}>
              {titleNode}
            </SimpleTextBlock>
          </div>
        )}
        {buttons && (
          <div className={styles.buttons}>
            <Button
              hierarchy="Tertiary"
              size="XL"
              icon="Only"
              iconElement={<Icon name="arrow-left" />}
              className={styles.button}
              aria-label={previousLabel}
              aria-controls={slidesId}
              disabled={total < 2}
              onClick={() => go(current - 1)}
            />
            <Button
              hierarchy="Tertiary"
              size="XL"
              icon="Only"
              iconElement={<Icon name="arrow-right" />}
              className={styles.button}
              aria-label={nextLabel}
              aria-controls={slidesId}
              disabled={total < 2}
              onClick={() => go(current + 1)}
            />
          </div>
        )}
        {indicatorNode != null && indicatorNode !== false && <div className={styles.pagination}>{indicatorNode}</div>}
      </div>
    </div>
  );
}

export default GallerySlider;
