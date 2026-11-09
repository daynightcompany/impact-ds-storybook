import type { HTMLAttributes, ReactNode } from 'react';
import styles from './GalleryPreview.module.css';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface GalleryPreviewProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The tiles of the gallery: any elements (pictures, `ImagePreview`) that
   * have a size of their own. Figma shows nine `ImagePreview` tiles of
   * different sizes, which is what you get without it.
   */
  children?: ReactNode;
}

/** The nine tiles of the Figma frame, width then height, in its order. */
const FIGMA_TILES = [
  [586, 652],
  [475, 388],
  [383, 319],
  [924, 345.6],
  [586, 388],
  [383, 564],
  [383, 319],
  [469, 365],
  [586, 388],
] as const;

/**
 * Impact DS Gallery preview — converted from the Figma "Gallery preview"
 * component set (node 9587:7965 in the SMAL Impact Design System (Public)
 * Figma file): a wall of pictures of different sizes in one frame, as wide as
 * the viewport (1920 on Desktop, 375 on Mobile) and 1080 high, filled with
 * surface/primary. The tiles lie in rows that wrap, spacing/s apart, with
 * rounded corners (cornerRadius/l); the rows are centered, so a wall that is
 * higher than the frame is cut off equally at the top and at the bottom, and
 * a tile that is wider than the frame is cut off equally at both sides, as on
 * Mobile. Figma has one variant of it, `Type=Gallery` with `Paspartu=False`.
 */
export function GalleryPreview({ children, className, ...rest }: GalleryPreviewProps) {
  const classes = [styles.preview, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children ??
        FIGMA_TILES.map(([width, height], index) => <ImagePreview key={index} style={{ width, height }} />)}
    </div>
  );
}

export default GalleryPreview;
