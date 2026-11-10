import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './ImageCarouselText.module.css';
import { textSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type ImageCarouselTextState = 'Active' | 'Inactive';

export interface ImageCarouselTextProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /**
   * Figma "State": Active is the item of the picture on show, in the paragraph
   * colour, and is not interactive (it is marked with `aria-current`); Inactive
   * is the paler item of a picture that is not on show, and is a button that
   * goes to it: give it `onClick`.
   */
  state?: ImageCarouselTextState;
  /** The title. Figma shows the placeholder "Placeholder Title". */
  children?: ReactNode;
  /** The line under the title. `true` shows the Figma placeholder "Placeholder subtitle", a string or a node replaces it, `false` hides it. */
  subtitle?: TextSlot;
  /**
   * Makes the line of the Active item the progress of a timer (not in Figma yet,
   * where the line is whole): the time the line takes to fill from the top to the
   * bottom, in milliseconds. The part that is not filled yet looks like the line of
   * an Inactive item. Only the Active item shows it, and an item that becomes
   * Active starts the line again. Without `duration` the line stays whole, as in
   * Figma.
   */
  duration?: number;
  /** Holds the progress where it is (with `duration`). */
  paused?: boolean;
  /** The line of the Active item is full (with `duration`): time to make the next item Active. */
  onProgressEnd?: () => void;
}

/**
 * Impact DS Image carousel text — converted from the Figma "Image carousel
 * text" component set (node 9587:8004 in the SMAL Impact Design System
 * (Public) Figma file): a title and a line of text under it, with a thin
 * vertical line at its left, for one picture of an image carousel. The Active
 * item is in the paragraph colour and is marked with `aria-current`; the
 * Inactive one is in the secondary paragraph colour at half strength, and is a
 * button that goes to its picture. It is as wide as the space it is in (435 on
 * the Figma component page, 327 in the carousel). The type follows the
 * breakpoint tokens, so Mobile is smaller. With `duration` the line of the
 * Active item is the progress of an auto-advancing carousel, in place of a Slide
 * timer under the items: it fills from the top, in the paragraph colour, and
 * `onProgressEnd` says when it is full.
 */
export function ImageCarouselText({
  state = 'Active',
  children = 'Placeholder Title',
  subtitle,
  duration,
  paused = false,
  onProgressEnd,
  className,
  ...rest
}: ImageCarouselTextProps) {
  const active = state === 'Active';
  // Only the Active item shows the progress. An item that becomes Active is a new element
  // (it was a button, it is a div), so its fill always starts afresh.
  const timed = active && duration != null && duration > 0;
  const classes = [styles.item, active ? styles['state-active'] : styles['state-inactive'], className]
    .filter(Boolean)
    .join(' ');
  const subtitleNode = textSlot(subtitle, 'Placeholder subtitle');
  const content = (
    <>
      <span
        className={styles.line}
        data-timed={timed ? '' : undefined}
        data-paused={paused ? '' : undefined}
        aria-hidden="true"
      >
        {timed && (
          <span
            className={styles.fill}
            style={{ '--item-duration': `${duration}ms` } as CSSProperties}
            onAnimationEnd={() => onProgressEnd?.()}
          />
        )}
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{children}</span>
        {subtitleNode != null && <span className={styles.subtitle}>{subtitleNode}</span>}
      </span>
    </>
  );

  if (active) {
    return (
      <div className={classes} aria-current="true" {...(rest as HTMLAttributes<HTMLDivElement>)}>
        {content}
      </div>
    );
  }

  return (
    <button type="button" className={classes} {...(rest as HTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

export interface ImageCarouselTextLayersProps extends HTMLAttributes<HTMLDivElement> {
  /** The items, one `ImageCarouselText` for each picture. Figma shows four: the first Active, the other three Inactive. */
  children?: ReactNode;
}

/**
 * The Figma "Text layers" frame of the image carousel: the text items in a
 * column, spacing/l apart, 327 wide (or as wide as the space it is in, when
 * that is narrower).
 */
export function ImageCarouselTextLayers({ children, className, ...rest }: ImageCarouselTextLayersProps) {
  const classes = [styles.layers, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children ?? (
        <>
          <ImageCarouselText state="Active" />
          <ImageCarouselText state="Inactive" />
          <ImageCarouselText state="Inactive" />
          <ImageCarouselText state="Inactive" />
        </>
      )}
    </div>
  );
}

export default ImageCarouselText;
