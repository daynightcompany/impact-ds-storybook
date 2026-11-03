import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import styles from './Breadcrumb.module.css';
import buttonStyles from '../Button/Button.module.css';
import { Icon } from '../Icon';
import { MoreMenu } from '../Menu/Menu';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface BreadcrumbItem extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** The text of the item (the label of the Figma Button). */
  label: ReactNode;
}

export interface BreadcrumbProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * The path, from the first page to the current one, which is the last item
   * (Figma's "Current page": drawn disabled, at 30%, and never a link). An
   * item with an `href` is a link; without one it is plain text. Any other
   * anchor attribute (`onClick` for a client-side router, say) goes to the link,
   * and to its entry in the "more" menu.
   */
  items: BreadcrumbItem[];
  /**
   * How many items are shown before the middle ones are folded into a "more"
   * button: with more items than this, only the first item and the last two
   * are shown. Figma's variant "More than 4 items" is what you get with
   * `maxItems` 4 (the default) and five or more items.
   */
  maxItems?: number;
  /** Accessible name of the "more" button (and of the menu it opens). */
  moreLabel?: string;
}

/**
 * Impact DS Breadcrumb — converted from the Figma "Breadcrumb" component set
 * (node 9587:6612): the pages of the path as Tertiary Buttons of size L, with
 * an arrow in a Button between them, spacing/2xs apart. The variant "More
 * than 4 items" shows the first item, a "more" Button, and the last two
 * items. Figma's items are Buttons; here they are links (`a`), drawn with the
 * Button's own classes, so they look and behave like the Buttons.
 *
 * The "more" button opens a menu (a popover) listing the folded items, as
 * links; choosing one goes there, Escape closes the menu. The current page, the
 * last item, is drawn disabled as in Figma (30%). A `nav` landmark with an
 * ordered list: the arrows are decoration, and the last item has
 * `aria-current="page"`.
 */
export function Breadcrumb({
  items,
  maxItems = 4,
  moreLabel = 'Show all pages',
  'aria-label': ariaLabel = 'Breadcrumb',
  className,
  ...rest
}: BreadcrumbProps) {
  const last = items.length - 1;
  const folded = items.length > Math.max(maxItems, 3);
  // The entries of the list: an item (by index) or the "more" button.
  const entries: (number | 'more')[] = folded ? [0, 'more', last - 1, last] : items.map((_, index) => index);

  return (
    <nav aria-label={ariaLabel} className={[styles.breadcrumb, className].filter(Boolean).join(' ')} {...rest}>
      <ol className={styles.list}>
        {entries.flatMap((entry, position) => {
          const separator =
            position > 0 ? (
              <li key={`separator-${position}`} className={styles.separator} aria-hidden="true">
                <Icon name="arrow-right" size={24} />
              </li>
            ) : null;

          if (entry === 'more') {
            // The items between the first one and the last two are in the menu, as links.
            const hidden = items
              .slice(1, last - 1)
              .map(({ label, id, href, target, rel, download, onClick }) => ({ label, id, href, target, rel, download, onClick }));
            return [
              separator,
              <li key="more" className={styles.item}>
                <MoreMenu label={moreLabel} size="L" className={styles.more} items={hidden} />
              </li>,
            ];
          }

          const { label, href, className: itemClassName, ...anchor } = items[entry];
          const classes = [buttonStyles.button, buttonStyles.tertiary, buttonStyles['size-l'], styles.link, itemClassName]
            .filter(Boolean)
            .join(' ');
          if (entry === last) {
            // The current page: Figma's disabled Tertiary Button. It is the page you are on, so it
            // is not a link; `aria-disabled` keeps it out of the contrast check, as a disabled Button.
            return [
              separator,
              <li key={`item-${entry}`} className={styles.item}>
                <a className={`${classes} ${styles.current}`} role="link" aria-disabled="true" aria-current="page">
                  {label}
                </a>
              </li>,
            ];
          }
          return [
            separator,
            <li key={`item-${entry}`} className={styles.item}>
              {href !== undefined ? (
                <a className={classes} href={href} {...anchor}>
                  {label}
                </a>
              ) : (
                <span className={`${classes} ${styles.text}`}>{label}</span>
              )}
            </li>,
          ];
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
