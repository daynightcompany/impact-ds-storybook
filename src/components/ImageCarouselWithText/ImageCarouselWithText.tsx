import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ImageCarouselWithText.module.css';
import { ImageCarouselTextLayers } from '../ImageCarouselText/ImageCarouselText';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface ImageCarouselWithTextProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma slot "Slot": the content of the frame. Figma fills it with a column
   * of four `ImageCarouselText` items (an `ImageCarouselTextLayers`, the first
   * item Active) and an `ImagePreview` beside it, which is what you get
   * without it. Whatever you pass takes its place, and lines up and wraps the
   * same way: the slot is a row that wraps, so what does not fit beside the
   * first item goes below it.
   */
  children?: ReactNode;
}

/**
 * Impact DS Image carousel with text — converted from the Figma "Image
 * carousel with text/Left/Top" component (node 9587:7983 in the SMAL Impact
 * Design System (Public) Figma file): a frame as big as the viewport (the
 * Figma viewport/width and viewport/height variables: 1920 x 1080 on Desktop,
 * 375 x 812 on Mobile) with spacing/6xl around its content, which is one
 * slot. On Desktop the text items sit at the left of the picture; on Mobile
 * the slot has no room for both, so the picture wraps below the items. The
 * background is background/primary.
 */
export function ImageCarouselWithText({ children, className, ...rest }: ImageCarouselWithTextProps) {
  const classes = [styles.carousel, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <div className={styles.slot}>
        {children ?? (
          <>
            <ImageCarouselTextLayers />
            <ImagePreview className={styles.image} />
          </>
        )}
      </div>
    </div>
  );
}

export default ImageCarouselWithText;
