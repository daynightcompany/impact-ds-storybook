import type { HTMLAttributes, ReactNode } from 'react';
import styles from './PopupText.module.css';
import { buttonSlot, TextPart, textSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface PopupTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The headline. Pass a heading element to make it one. */
  headline?: ReactNode;
  /** Figma boolean "Pre title": the line between the headline and the body. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  preTitle?: TextSlot;
  /** Figma boolean "CTA": the Secondary button under the text. `true` shows the default button, a string is its label, a node replaces it (give a button `size="XL"`), `false` hides it. */
  cta?: ButtonSlot;
  /** Called by the default button. */
  onCtaClick?: () => void;
  /** The body text. */
  children?: ReactNode;
}

const BODY =
  'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. ';

/**
 * Impact DS Popup text — converted from the Figma "Text/PopupTextStyle"
 * component (node 9587:7449): a headline, a pre title and a body text over a
 * Secondary XL button, left aligned, for the content of a popup or a dialog. It
 * is as wide as the space it is in. The type and spacing follow the breakpoint
 * tokens, so Mobile is smaller (the XL button too).
 */
export function PopupText({
  headline = 'Placeholder Title',
  preTitle,
  cta,
  onCtaClick,
  children = BODY,
  className,
  ...rest
}: PopupTextProps) {
  const classes = [styles.text, className].filter(Boolean).join(' ');
  const pre = textSlot(preTitle, 'Teamwork, dream work.');
  const ctaNode = buttonSlot(cta, {
    label: 'Button',
    hierarchy: 'Secondary',
    size: 'XL',
    icon: 'Trailing',
    onClick: onCtaClick,
  });
  return (
    <div className={classes} {...rest}>
      <div className={styles.container}>
        <TextPart className={styles.headline}>{headline}</TextPart>
        <div className={styles.copies}>
          {pre != null && <TextPart className={styles.preTitle}>{pre}</TextPart>}
          <TextPart className={styles.body}>{children}</TextPart>
        </div>
      </div>
      {ctaNode}
    </div>
  );
}

export default PopupText;
