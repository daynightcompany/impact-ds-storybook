import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SalesCardTextBlock.module.css';
import { buttonSlot, TextPart, textSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface SalesCardTextBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma text "Full price": the large price. */
  fullPrice?: ReactNode;
  /** Figma text "Discount price": the smaller price beside it. `true` shows the default, a string or a node replaces it, `false` hides it. */
  discountPrice?: TextSlot;
  /** The name of the product. Pass a heading element to make it one. */
  productName?: ReactNode;
  /** The line under the name. `true` shows the default, a string or a node replaces it, `false` hides it. */
  slogan?: TextSlot;
  /** The Primary button. `true` shows the default button, a string is its label, a node replaces it (give a button `size="L"`), `false` hides it. */
  primaryButton?: ButtonSlot;
  /** The Secondary button; the same as `primaryButton`. */
  secondaryButton?: ButtonSlot;
  /** Called by the default Primary button. */
  onPrimaryClick?: () => void;
  /** Called by the default Secondary button. */
  onSecondaryClick?: () => void;
}

/**
 * Impact DS Sales card text block — converted from the Figma
 * "SalesCardsTextStyle/SalesCardsTextStyle" component (node 9587:7464): two
 * prices, the name of a product and a slogan, over two L buttons (Primary and
 * Secondary). It is as wide as the space it is in, at most 514, and has
 * spacing/m of padding and between its parts. The buttons stand under the text
 * when the text would get narrower than 272, and stack when they would get
 * narrower than 176 each or than their labels need. The type, spacing and button sizes follow the
 * breakpoint tokens, so Mobile is smaller.
 */
export function SalesCardTextBlock({
  fullPrice = '199.99 €',
  discountPrice,
  productName = 'Placeholder Title',
  slogan,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  className,
  ...rest
}: SalesCardTextBlockProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');
  const discount = textSlot(discountPrice, '234.99 €');
  const slogans = textSlot(slogan, 'Dynamic Vocal Microphone');
  const primary = buttonSlot(primaryButton, { label: 'Button', hierarchy: 'Primary', size: 'L', onClick: onPrimaryClick });
  const secondary = buttonSlot(secondaryButton, {
    label: 'Button',
    hierarchy: 'Secondary',
    size: 'L',
    onClick: onSecondaryClick,
  });
  return (
    <div className={classes} {...rest}>
      <div className={styles.content}>
        <div className={styles.prices}>
          <span className={styles.fullPrice}>{fullPrice}</span>
          {discount != null && (
            <span className={styles.discountBox}>
              <span className={styles.discountPrice}>{discount}</span>
            </span>
          )}
        </div>
        <div className={styles.names}>
          <TextPart className={styles.name}>{productName}</TextPart>
          {slogans != null && <TextPart className={styles.slogan}>{slogans}</TextPart>}
        </div>
      </div>
      {(primary != null || secondary != null) && (
        <div className={styles.buttons}>
          {primary}
          {secondary}
        </div>
      )}
    </div>
  );
}

export default SalesCardTextBlock;
