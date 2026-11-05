import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Quote.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type QuoteSize = 'L' | 'M' | 'S';

export interface QuoteProps extends HTMLAttributes<HTMLElement> {
  /** Figma "Size": L is a large statement in a gradient on a card, M a centred quote on a card, S an italic quote with a name under it. */
  size?: QuoteSize;
  /** The quote. */
  children?: ReactNode;
  /**
   * Who said it: in M the name and, under it, the role; in S one line after the
   * quote. Figma has none in L; one you give is set like the one in M.
   */
  author?: ReactNode;
}

const QUOTES: Record<QuoteSize, ReactNode> = {
  L: (
    <>
      In one hour,
      <br />
      the sun creates enough energy to power the entire planet for a year.
    </>
  ),
  M: '"Microinverters save installation time for us while saving our customers money in the long run"',
  S: '"4K X works flawlessly with all the specs of my PS5 and Nintendo Switch. Just connect it and you can get started. This is the Elgato way."',
};

const AUTHORS: Record<QuoteSize, ReactNode> = {
  L: undefined,
  M: (
    <>
      Marc Lopata,
      <br />
      President and principle engineer at Pivot Energy
    </>
  ),
  S: '- UnderwaterFrank',
};

/**
 * Impact DS Quote — converted from the Figma "Quote" component set (node
 * 9587:7416). L is a large statement with a purple to wine gradient on a card;
 * M is a centred quote with its author on a card, with spacing/6xl of room
 * around the card as in Figma; S is an italic serif quote with the author in
 * semi bold under it. It is a `<figure>` with a `<blockquote>` and, with an
 * author, a `<figcaption>`. It is as wide as the space it is in, and the type
 * and spacing follow the breakpoint tokens, so Mobile is smaller.
 */
export function Quote({ size = 'L', children, author, className, ...rest }: QuoteProps) {
  const classes = [styles.quote, styles[`size-${size.toLowerCase()}`], className].filter(Boolean).join(' ');
  const quote = children ?? QUOTES[size];
  const by = author === undefined ? AUTHORS[size] : author;
  return (
    <figure className={classes} {...rest}>
      <div className={styles.card}>
        <blockquote className={styles.text}>{quote}</blockquote>
        {by != null && by !== false && <figcaption className={styles.author}>{by}</figcaption>}
      </div>
    </figure>
  );
}

export default Quote;
