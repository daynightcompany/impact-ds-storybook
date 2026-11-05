import type { HTMLAttributes, ReactNode } from 'react';
import styles from './TextStyle.module.css';
import { TextPart, textSlot, type TextSlot } from '../TextParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type TextStyleHierarchy = 'Primary' | 'Secondary' | 'Tertiary';

export interface TextStyleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma "Hierarchy": the size of the type steps down from Primary (72 title) to Tertiary (32 title). */
  hierarchy?: TextStyleHierarchy;
  /** The title (Figma has "Placeholder Title" in Primary and "Placeholder title" in the others). Pass a heading element to make it one. */
  title?: ReactNode;
  /** Figma boolean "Show disclaimer". `true` shows the default text, a string or a node replaces it, `false` hides it. */
  disclaimer?: TextSlot;
  /** The body text. */
  children?: ReactNode;
}

const BODY =
  'In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available. ';
const DISCLAIMER = 'Lorem ipsum may be used as a placeholder before the final copy is available. ';

/**
 * Impact DS Text style — converted from the Figma "Text/PrimaryTextStyle"
 * component set (node 9587:7396): a title, a body text and a small grey
 * disclaimer in a column, left aligned. Three hierarchies set the type and the
 * space between the parts. It is as wide as the space it is in. The sizes and
 * spacing follow the breakpoint tokens, so Mobile is smaller.
 */
export function TextStyle({
  hierarchy = 'Primary',
  title,
  disclaimer,
  children = BODY,
  className,
  ...rest
}: TextStyleProps) {
  const classes = [styles.text, styles[hierarchy.toLowerCase()], className].filter(Boolean).join(' ');
  const disclaimerNode = textSlot(disclaimer, DISCLAIMER);
  const defaultTitle = hierarchy === 'Primary' ? 'Placeholder Title' : 'Placeholder title';
  return (
    <div className={classes} {...rest}>
      <TextPart className={styles.title}>{title === undefined ? defaultTitle : title}</TextPart>
      <TextPart className={styles.body}>{children}</TextPart>
      {disclaimerNode != null && <TextPart className={styles.disclaimer}>{disclaimerNode}</TextPart>}
    </div>
  );
}

export default TextStyle;
