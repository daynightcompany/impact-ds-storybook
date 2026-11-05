import type { HTMLAttributes, ReactNode } from 'react';
import styles from './SimpleTextBlock.module.css';
import { TextPart, textSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type SimpleTextBlockSize = 'L' | 'M';

export interface SimpleTextBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma "Size": L has a 32 title and a 24 subtitle, M a 16 title and a caption under it. */
  size?: SimpleTextBlockSize;
  /** Figma boolean "Eyebrow": the small line over the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  eyebrow?: TextSlot;
  /** The title. Pass a heading element to make it one. */
  children?: ReactNode;
  /** Figma boolean "Subtitle": the line under the title. `true` shows the default text, a string or a node replaces it, `false` hides it. */
  subtitle?: TextSlot;
}

/**
 * Impact DS Simple text block — converted from the Figma "Text/Card text
 * block" component set (node 9587:7484): an eyebrow, a title and a subtitle in a
 * column, left aligned, for a card. It is as wide as the space it is in, up to
 * 640. The type and spacing follow the breakpoint tokens, so Mobile is smaller.
 */
export function SimpleTextBlock({
  size = 'L',
  eyebrow,
  children = 'Title',
  subtitle,
  className,
  ...rest
}: SimpleTextBlockProps) {
  const classes = [styles.block, styles[`size-${size.toLowerCase()}`], className].filter(Boolean).join(' ');
  const eyebrowNode = textSlot(eyebrow, 'H6 text');
  const subtitleNode = textSlot(subtitle, size === 'L' ? 'H5' : 'Subtitle');
  return (
    <div className={classes} {...rest}>
      <div className={styles.container}>
        {eyebrowNode != null && <TextPart className={styles.eyebrow}>{eyebrowNode}</TextPart>}
        <TextPart className={styles.title}>{children}</TextPart>
        {subtitleNode != null && <TextPart className={styles.subtitle}>{subtitleNode}</TextPart>}
      </div>
    </div>
  );
}

export default SimpleTextBlock;
