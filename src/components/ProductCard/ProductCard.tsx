import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ProductCard.module.css';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { TextPart } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma Size: L fills the width it is in, M is 250 wide and S is 125 wide. */
export type ProductCardSize = 'L' | 'M' | 'S';

export interface ProductCardProps extends HTMLAttributes<HTMLElement> {
  size?: ProductCardSize;
  /** Figma boolean "labels": the line with the name of the product under the picture. */
  labels?: boolean;
  /** Figma text "productName". Pass a heading element to make it one. */
  productName?: ReactNode;
  /**
   * The picture. Without it the grey placeholder (`ImagePreview`) is shown; pass
   * an `ImagePreview` with a `src`, or an `img`, which is cropped to fill the box.
   */
  picture?: ReactNode;
  /** Makes the whole card a link (`a`). Without a visible name (`labels` off) give it an `aria-label`. */
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Impact DS Product card — converted from the Figma "Card/ProductCard" component
 * set (node 9587:7693 in the SMAL Impact Design System (Public) Figma file): a
 * picture over the name of a product, which is centered. Size is a variant: L
 * is as wide as the space it is in with a 345.6 high picture and rounded
 * spacing/3xl; M is 250 x 250 with corner radius xl and S is 125 x 125 with
 * corner radius s, both with the name wrapping under the picture. The corner
 * radius, the spacing and the type follow the breakpoint tokens, so Mobile is
 * smaller. Figma has no hover or pressed state for it.
 */
export function ProductCard({
  size = 'L',
  labels = true,
  productName = 'Product Name',
  picture,
  href,
  target,
  rel,
  className,
  ...rest
}: ProductCardProps) {
  const classes = [styles.card, styles[`size-${size.toLowerCase()}`], className].filter(Boolean).join(' ');
  const content = (
    <>
      <div className={styles.picture}>{picture ?? <ImagePreview />}</div>
      {labels && (
        <div className={styles.name}>
          <TextPart className={styles.text}>{productName}</TextPart>
        </div>
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <a className={classes} href={href} target={target} rel={rel} {...(rest as HTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <div className={classes} {...(rest as HTMLAttributes<HTMLDivElement>)}>
      {content}
    </div>
  );
}

export default ProductCard;
