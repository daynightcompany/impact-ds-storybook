import styles from './SalesCard.module.css';
import { SalesCardTextBlock, type SalesCardTextBlockProps } from '../SalesCardTextBlock/SalesCardTextBlock';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type SalesCardProps = SalesCardTextBlockProps;

/**
 * Impact DS Sales card — converted from the Figma "Card/Sales card" component
 * (node 9587:7737 in the SMAL Impact Design System (Public) Figma file): the
 * Sales card text block (two prices, the name of a product, a slogan and two
 * buttons) on a surface/primary card with corner radius m and spacing/l of
 * padding. It is as wide as the space it is in, at most 514 and at least 324.
 * The props are those of the text block. The padding, the corner radius and the
 * type follow the breakpoint tokens, so Mobile is smaller.
 */
export function SalesCard({ className, ...rest }: SalesCardProps) {
  return <SalesCardTextBlock className={[styles.card, className].filter(Boolean).join(' ')} {...rest} />;
}

export default SalesCard;
