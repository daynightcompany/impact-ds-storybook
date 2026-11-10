import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './GalleryPreview.module.css';
import { ImagePreview, type ImagePreviewProps } from '../ImagePreview/ImagePreview';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface GalleryPreviewProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * The tiles of the gallery: any elements (pictures, `ImagePreview`) that
   * have a size of their own, or `GalleryPreviewTile`s, which also fit a
   * narrow frame. Figma shows nine `ImagePreview` tiles of different sizes,
   * which is what you get without it.
   */
  children?: ReactNode;
}

export interface GalleryPreviewTileProps extends ImagePreviewProps {
  /** The width of the tile on Desktop, in the pixels of the Figma frame. */
  width: number;
  /** The height of the tile on Desktop, in the pixels of the Figma frame. */
  height: number;
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
 * One tile of the gallery: an `ImagePreview` (a picture, or the placeholder)
 * of the size Figma gives it, `width` x `height` on Desktop. A tile that is
 * wider than the frame, as every one is on Mobile, shrinks to the width of the
 * frame and keeps its proportions, so that it is never cut off.
 */
export function GalleryPreviewTile({ width, height, className, style, ...rest }: GalleryPreviewTileProps) {
  const classes = [styles.tile, className].filter(Boolean).join(' ');
  return (
    <ImagePreview
      className={classes}
      style={{ ...style, '--tile-width': width, '--tile-height': height } as CSSProperties}
      {...rest}
    />
  );
}

/**
 * Impact DS Gallery preview — converted from the Figma "Gallery preview"
 * component set (node 9587:7965 in the SMAL Impact Design System (Public)
 * Figma file): a wall of pictures of different sizes in one frame, as wide as
 * the viewport (1920 on Desktop, 375 on Mobile) and 1080 high, filled with
 * surface/primary. The tiles lie in rows that wrap, spacing/s apart, with
 * rounded corners (cornerRadius/l); the rows are centered, so on Desktop a
 * wall that is higher than the frame is cut off equally at the top and at the
 * bottom. Figma has one variant of it, `Type=Gallery` with `Paspartu=False`.
 *
 * Figma has no Mobile layout for it: its tiles keep their Desktop sizes, which
 * are all wider than a Mobile frame. Here, on Mobile, nothing is cut off: the
 * frame grows with its content and the `GalleryPreviewTile`s fill its width,
 * one under the other, with their proportions.
 */
export function GalleryPreview({ children, className, ...rest }: GalleryPreviewProps) {
  const classes = [styles.preview, className].filter(Boolean).join(' ');
  return (
    <div className={classes} {...rest}>
      {children ??
        FIGMA_TILES.map(([width, height], index) => <GalleryPreviewTile key={index} width={width} height={height} />)}
    </div>
  );
}

export default GalleryPreview;
