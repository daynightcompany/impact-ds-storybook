import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CardWithIcons.module.css';
import { Icon } from '../Icon';
import { SimpleTextBlock } from '../SimpleTextBlock/SimpleTextBlock';
import { buttonSlot, type ButtonSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CardWithIconsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The icon, drawn 84 x 84. Without it the placeholder (a circle) is shown. Pass an `Icon` with `size={84}` and `fixedStroke`. */
  icon?: ReactNode;
  /** Figma boolean "Eyebrow" of the text block: the small line over the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  eyebrow?: TextSlot;
  /** The title. Pass a heading element to make it one. */
  children?: ReactNode;
  /** Figma boolean "Subtitle" of the text block: the line under the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  subtitle?: TextSlot;
  /** Figma boolean "cta": the two buttons under (or beside) the text. */
  cta?: boolean;
  /** The Primary button. `true` shows the default button, a string is its label, a node replaces it (give a button `size="XL"`), `false` hides it. */
  primaryButton?: ButtonSlot;
  /** The Secondary button; the same as `primaryButton`. */
  secondaryButton?: ButtonSlot;
  /** Called by the default Primary button. */
  onPrimaryClick?: () => void;
  /** Called by the default Secondary button. */
  onSecondaryClick?: () => void;
}

/**
 * Impact DS Card with icons — converted from the Figma "Card/Card with icons"
 * component (node 9587:7746 in the SMAL Impact Design System (Public) Figma
 * file): an 84 x 84 icon over a text block (eyebrow, title, subtitle) and,
 * with `cta`, two XL buttons (Primary and Secondary). It has a
 * background/primary fill, corner radius l and spacing/m of padding, is as wide
 * as the space it is in and at least 272. The buttons stand beside the text
 * when there is room for both (the text needs 200, the buttons 176 each side
 * by side or stacked) and under it otherwise. Figma has only the Left
 * alignment and the Default state. The padding, corner radius, type and button
 * size follow the breakpoint tokens, so Mobile is smaller.
 */
export function CardWithIcons({
  icon,
  eyebrow,
  children,
  subtitle,
  cta = true,
  primaryButton,
  secondaryButton,
  onPrimaryClick,
  onSecondaryClick,
  className,
  ...rest
}: CardWithIconsProps) {
  const classes = [styles.card, className].filter(Boolean).join(' ');
  const primary = buttonSlot(primaryButton, { label: 'Button', hierarchy: 'Primary', size: 'XL', onClick: onPrimaryClick });
  const secondary = buttonSlot(secondaryButton, {
    label: 'Button',
    hierarchy: 'Secondary',
    size: 'XL',
    onClick: onSecondaryClick,
  });
  return (
    <div className={classes} {...rest}>
      <span className={styles.icon}>{icon ?? <Icon size={84} fixedStroke />}</span>
      <div className={styles.body}>
        <div className={styles.text}>
          <SimpleTextBlock size="L" eyebrow={eyebrow} subtitle={subtitle}>
            {children}
          </SimpleTextBlock>
        </div>
        {cta && (primary != null || secondary != null) && (
          <div className={styles.buttons}>
            {primary}
            {secondary}
          </div>
        )}
      </div>
    </div>
  );
}

export default CardWithIcons;
