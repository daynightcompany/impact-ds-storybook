import type { HTMLAttributes } from 'react';
import styles from './ComplexTextBlock.module.css';
import { buttonSlot, TextPart, textSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface ComplexTextBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Figma boolean "Uptitle": the small line over the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  uptitle?: TextSlot;
  /** Figma boolean "Title": the large title. `true` shows the default text, a string or a node replaces it (a heading element makes it one), `false` hides it. */
  title?: TextSlot;
  /** Figma boolean "Subtitle". */
  subtitle?: TextSlot;
  /** Figma boolean "Quote": the italic serif line. */
  quote?: TextSlot;
  /** Figma boolean "Body text". */
  bodyText?: TextSlot;
  /** Figma boolean "CTA": the row of buttons. */
  cta?: boolean;
  /** Figma boolean "Primary button" (in the CTA row). `true` shows the default button, a string is its label, a node replaces it (give a button `size="XL"`), `false` hides it. */
  primaryButton?: ButtonSlot;
  /** Figma boolean "Secondary button" (in the CTA row); the same as `primaryButton`. */
  secondaryButton?: ButtonSlot;
  /** Called by the default Primary button. */
  onPrimaryClick?: () => void;
  /** Called by the default Secondary button. */
  onSecondaryClick?: () => void;
}

const QUOTE = 'Lorem ipsum may be used as a placeholder before the final copy is available. ';
const BODY =
  'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. ';

/**
 * Impact DS Complex text block — converted from the Figma "Text/Complex text
 * block" component (node 9587:7512): an uptitle, a title, a subtitle, a quote, a
 * body text and a row of two XL buttons, left aligned in a column at most 640
 * wide, centred on the surface colour with spacing/6xl of padding. It is as wide
 * as the space it is in and as tall as its content; give it a height (or let a
 * hero stretch it) and the column is centred in it. The buttons are as wide as
 * their labels; when the column is narrower than the two of them they stack over
 * its full width, the Primary on top. The type, spacing and button sizes follow
 * the breakpoint tokens, so Mobile is smaller.
 */
export function ComplexTextBlock({
  uptitle,
  title,
  subtitle,
  quote,
  bodyText,
  cta = true,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  className,
  ...rest
}: ComplexTextBlockProps) {
  const classes = [styles.block, className].filter(Boolean).join(' ');
  const uptitleNode = textSlot(uptitle, 'H6 text');
  const titleNode = textSlot(title, 'Text H1');
  const subtitleNode = textSlot(subtitle, 'H5');
  const quoteNode = textSlot(quote, QUOTE);
  const bodyNode = textSlot(bodyText, BODY);
  const primary = cta
    ? buttonSlot(primaryButton, { label: 'Button label text', hierarchy: 'Primary', size: 'XL', onClick: onPrimaryClick })
    : null;
  const secondary = cta
    ? buttonSlot(secondaryButton, {
        label: 'Button label text',
        hierarchy: 'Secondary',
        size: 'XL',
        onClick: onSecondaryClick,
      })
    : null;
  return (
    <div className={classes} {...rest}>
      <div className={styles.content}>
        {uptitleNode != null && <TextPart className={styles.uptitle}>{uptitleNode}</TextPart>}
        {titleNode != null && <TextPart className={styles.title}>{titleNode}</TextPart>}
        {subtitleNode != null && <TextPart className={styles.subtitle}>{subtitleNode}</TextPart>}
        {quoteNode != null && <TextPart className={styles.quote}>{quoteNode}</TextPart>}
        {bodyNode != null && <TextPart className={styles.body}>{bodyNode}</TextPart>}
        {(primary != null || secondary != null) && (
          <div className={styles.buttons}>
            {primary}
            {secondary}
          </div>
        )}
      </div>
    </div>
  );
}

export default ComplexTextBlock;
