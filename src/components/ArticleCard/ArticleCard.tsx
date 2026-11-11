import type { HTMLAttributes, ReactNode } from 'react';
import styles from './ArticleCard.module.css';
import { ImagePreview } from '../ImagePreview/ImagePreview';
import { SimpleTextBlock } from '../SimpleTextBlock/SimpleTextBlock';
import { buttonSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma "image": Top puts the picture over the text, Background puts it behind the whole card. */
export type ArticleCardImage = 'Top' | 'Background';
/** Figma "background" of a Top card: a Card fill, or None. (A Background card has the picture as its background.) */
export type ArticleCardBackground = 'Card' | 'None';
/** Figma "textAndButtonsColor" of a Background card: Secondary is the inverse text colour, Primary the default one. (A Top card has the default colours.) */
export type ArticleCardTextColor = 'Secondary' | 'Primary';

export interface ArticleCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  image?: ArticleCardImage;
  /** Only for `image="Top"`: a white card (default) or no fill. */
  background?: ArticleCardBackground;
  /**
   * Only for `image="Background"`. Secondary (default) is the text colour
   * font/paragraph/tertiary, the inverse of the default one (white in Day mode,
   * black in Night mode): for a picture that is dark where the default text
   * would be dark. Primary keeps the default text colours. The buttons keep their
   * own colours in both, as in Figma.
   */
  textAndButtonsColor?: ArticleCardTextColor;
  /**
   * The picture. Without it the grey placeholder (`ImagePreview`) is shown; pass
   * an `ImagePreview` with a `src`, or an `img`, which is cropped to fill the box.
   */
  picture?: ReactNode;
  /** Figma boolean "Eyebrow" of the text block: the small line over the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  eyebrow?: TextSlot;
  /** The title. Pass a heading element to make it one. */
  children?: ReactNode;
  /** Figma boolean "Subtitle" of the text block: the line under the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  subtitle?: TextSlot;
  /** Figma boolean "ctaBlock": the two buttons. */
  ctaBlock?: boolean;
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
 * Impact DS Article card — converted from the Figma "Card/Articles" component
 * set (node 9587:7779 in the SMAL Impact Design System (Public) Figma file): a
 * picture, a text block (eyebrow, title, subtitle) and, with `ctaBlock`, two L
 * buttons (Primary and Secondary), on a card with corner radius l that is as
 * wide as the space it is in and at least 272.
 *
 * Figma has four variants. With `image="Top"` the 268 high picture is over the
 * text, on a background/primary Card or with no fill (None). With
 * `image="Background"` the picture fills a 520 high card, the text sits at its
 * top and the buttons at its bottom, in the inverse text colour (Secondary,
 * white in Day mode, for a dark picture) or the default one (Primary, for a
 * light picture). Figma has only the Left alignment. The spacing, corner
 * radius, type and button size follow the breakpoint tokens, so Mobile is
 * smaller. The buttons are as wide as their labels; when the card is narrower
 * than the two of them they stack over its full width, the Primary on top.
 */
export function ArticleCard({
  image = 'Top',
  background = 'Card',
  textAndButtonsColor = 'Secondary',
  picture,
  eyebrow,
  children,
  subtitle,
  ctaBlock = true,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  className,
  ...rest
}: ArticleCardProps) {
  const onPicture = image === 'Background';
  const classes = [
    styles.card,
    onPicture ? styles.onPicture : background === 'None' ? styles.plain : styles.filled,
    onPicture && textAndButtonsColor === 'Secondary' && styles.light,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const primary = buttonSlot(primaryButton, { label: 'Button', hierarchy: 'Primary', size: 'L', onClick: onPrimaryClick });
  const secondary = buttonSlot(secondaryButton, {
    label: 'Button',
    hierarchy: 'Secondary',
    size: 'L',
    onClick: onSecondaryClick,
  });
  const pictureBox = <div className={styles.picture}>{picture ?? <ImagePreview />}</div>;
  const text = (
    <SimpleTextBlock className={styles.text} size="L" eyebrow={eyebrow} subtitle={subtitle}>
      {children}
    </SimpleTextBlock>
  );
  const cta =
    ctaBlock && (primary != null || secondary != null) ? (
      <div className={styles.cta}>
        {primary}
        {secondary}
      </div>
    ) : null;

  return (
    <div className={classes} {...rest}>
      {pictureBox}
      <div className={styles.content}>
        {text}
        {cta}
      </div>
    </div>
  );
}

export default ArticleCard;
