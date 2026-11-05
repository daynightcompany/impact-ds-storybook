import type { HTMLAttributes, ReactNode } from 'react';
import styles from './BannerText.module.css';
import { buttonSlot, TextPart, textSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface BannerTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Figma boolean "Intro text": the small grey line over the headline. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  introText?: TextSlot;
  /** Figma boolean "Button": the Primary button at the end of the row. `true` shows the default button, a string is its label, a node replaces it (give a button `size="XL"`), `false` hides it. */
  button?: ButtonSlot;
  /** Called by the default button. */
  onButtonClick?: () => void;
  /** The headline. Pass a heading element to make it one. */
  children?: ReactNode;
}

/**
 * Impact DS Banner text — converted from the Figma "Text/BannerTextContainer"
 * component (node 9587:7434; "LPBannerTextContainer" inside): an intro line over
 * a large headline, with a Primary XL button at the end of the row. The row
 * wraps: the button drops under the text when the text would get narrower than
 * 272. It is as wide as the space it is in. The type and spacing follow the
 * breakpoint tokens, so Mobile is smaller (the XL button too).
 */
export function BannerText({
  introText,
  button,
  onButtonClick,
  children = 'Create and work effortlessly.',
  className,
  ...rest
}: BannerTextProps) {
  const classes = [styles.banner, className].filter(Boolean).join(' ');
  const intro = textSlot(introText, 'Meet Neo');
  const buttonNode = buttonSlot(button, {
    label: 'Button',
    hierarchy: 'Primary',
    size: 'XL',
    icon: 'Trailing',
    onClick: onButtonClick,
  });
  return (
    <div className={classes} {...rest}>
      <div className={styles.content}>
        {intro != null && <TextPart className={styles.intro}>{intro}</TextPart>}
        <TextPart className={styles.headline}>{children}</TextPart>
      </div>
      {buttonNode != null && <div className={styles.button}>{buttonNode}</div>}
    </div>
  );
}

export default BannerText;
