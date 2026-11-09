import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ImagePreview.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface ImagePreviewProps extends HTMLAttributes<HTMLDivElement> {
  /** The address of a picture. It covers the whole area (cropped, never stretched). */
  src?: string;
  /** What the picture shows. Empty by default, which marks the picture as decoration: describe it when it carries meaning. */
  alt?: string;
  /** Figma slot "Desktop image": your own picture, a `picture` element or a video. It replaces the grey placeholder. */
  children?: ReactNode;
}

/**
 * Impact DS Image preview — converted from the Figma "Image Preview" component
 * (node 9587:7876 in the SMAL Impact Design System (Public) Figma file): the
 * stand-in for a picture. Until a picture is given it is a grey area in
 * border/primary with an image icon in surface/primary in the middle, which is
 * 96 x 72 on Desktop and 64 x 48 on Mobile, as the Figma "Image" component
 * (node 9587:616) has it. It is as wide as the space it is in and 345.6 high;
 * cards that hold it set their own size.
 *
 * Give it a `src` for a picture, or `children` for anything else; both replace
 * the placeholder.
 */
export function ImagePreview({ src, alt = '', children, className, ...rest }: ImagePreviewProps) {
  const classes = [styles.preview, className].filter(Boolean).join(' ');
  let content: ReactNode;
  if (children != null && children !== false) {
    content = children;
  } else if (src) {
    content = <img className={styles.image} src={src} alt={alt} />;
  } else {
    content = (
      <div className={styles.placeholder} aria-hidden>
        <svg className={styles.icon} viewBox="0 0 96 72" fill="none" focusable="false">
          <path d="M24.7186 20.4095C30.4332 20.4095 35.0659 15.8406 35.0659 10.2047C35.0659 4.56881 30.4332 0 24.7186 0C19.0039 0 14.3713 4.56881 14.3713 10.2047C14.3713 15.8406 19.0039 20.4095 24.7186 20.4095Z" />
          <path d="M96 72H0L25.006 28.9134L35.7654 45.8913L56.6922 9.6378L96 72Z" />
        </svg>
      </div>
    );
  }
  return (
    <div className={classes} {...rest}>
      {content}
    </div>
  );
}

export default ImagePreview;
