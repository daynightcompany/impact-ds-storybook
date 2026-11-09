import type { HTMLAttributes, ReactNode } from 'react';
import styles from './HeroImageContainer.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface HeroImageContainerProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Figma slot "Image" (an instance swap): your own picture, a `picture`
   * element, an Image preview or a video. It replaces the placeholder and fills
   * the image area; an `img` or a video is cropped to it, never stretched.
   */
  image?: ReactNode;
}

/**
 * Impact DS Hero image container — converted from the Figma "HeroImageContainer"
 * component (node 9587:7867 in the SMAL Impact Design System (Public) Figma
 * file): a column as wide as the space it is in, filled with border/primary,
 * that holds one image the size of the viewport (the Figma `viewport/width` and
 * `viewport/height` variables: 1920 x 1080 on Desktop, 375 x 812 on Mobile),
 * centered, and clips what is wider than the space. Without an `image` the
 * image is the Figma "Image" placeholder: an image icon in surface/primary in
 * the middle, 96 x 72 as in the Figma component, which holds the Desktop one of
 * the Image variants on both.
 */
export function HeroImageContainer({ image, className, ...rest }: HeroImageContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      <div className={styles.image}>
        {image != null && image !== false ? (
          image
        ) : (
          <svg className={styles.icon} viewBox="0 0 96 72" fill="none" focusable="false" aria-hidden="true">
            <path d="M24.7186 20.4095C30.4332 20.4095 35.0659 15.8406 35.0659 10.2047C35.0659 4.56881 30.4332 0 24.7186 0C19.0039 0 14.3713 4.56881 14.3713 10.2047C14.3713 15.8406 19.0039 20.4095 24.7186 20.4095Z" />
            <path d="M96 72H0L25.006 28.9134L35.7654 45.8913L56.6922 9.6378L96 72Z" />
          </svg>
        )}
      </div>
    </div>
  );
}

export default HeroImageContainer;
