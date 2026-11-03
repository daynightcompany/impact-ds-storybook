import { useEffect, useRef, useState } from 'react';
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import styles from './Breadcrumb.module.css';
import buttonStyles from '../Button/Button.module.css';
import { Button } from '../Button/Button';
import { Icon } from '../Icon';
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
   * (Figma's "Current page"). An item with an `href` is a link; without one
   * it is plain text. Any other anchor attribute (`onClick` for a client-side
   * router, say) goes to the link.
   */
  items: BreadcrumbItem[];
  /**
   * How many items are shown before the middle ones are folded into a "more"
   * button: with more items than this, only the first item and the last two
   * are shown. Figma's variant "More than 4 items" is what you get with
   * `maxItems` 4 (the default) and five or more items.
   */
  maxItems?: number;
  /** Accessible name of the "more" button. */
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
 * The "more" button shows the folded items (and goes away) when it is pressed;
 * focus moves to the first of them. A `nav` landmark with an ordered list: the
 * arrows are decoration, and the last item has `aria-current="page"`.
 */
export function Breadcrumb({
  items,
  maxItems = 4,
  moreLabel = 'Show all pages',
  'aria-label': ariaLabel = 'Breadcrumb',
  className,
  ...rest
}: BreadcrumbProps) {
  const [expanded, setExpanded] = useState(false);
  const revealed = useRef<HTMLLIElement>(null);

  // Pressing "more" moves focus to the first item it reveals.
  useEffect(() => {
    if (!expanded) return;
    const item = revealed.current;
    const link = item?.querySelector<HTMLElement>('a');
    (link ?? item)?.focus();
  }, [expanded]);

  const last = items.length - 1;
  const folded = !expanded && items.length > Math.max(maxItems, 3);
  // The entries of the list: an item (by index) or the "more" button.
  const entries: (number | 'more')[] = folded
    ? [0, 'more', last - 1, last]
    : items.map((_, index) => index);

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
            return [
              separator,
              <li key="more" className={styles.item}>
                <Button
                  type="button"
                  hierarchy="Tertiary"
                  size="L"
                  icon="Only"
                  iconElement={<Icon name="more" size={24} />}
                  className={styles.more}
                  aria-label={moreLabel}
                  aria-expanded="false"
                  onClick={() => setExpanded(true)}
                />
              </li>,
            ];
          }

          const { label, href, className: itemClassName, ...anchor } = items[entry];
          const classes = [buttonStyles.button, buttonStyles.tertiary, buttonStyles['size-l'], styles.link, itemClassName]
            .filter(Boolean)
            .join(' ');
          const current = entry === last ? ('page' as const) : undefined;
          // The first item that "more" revealed takes focus.
          const first = expanded && entry === 1;
          return [
            separator,
            <li key={`item-${entry}`} className={styles.item} ref={first ? revealed : undefined} tabIndex={first ? -1 : undefined}>
              {href !== undefined ? (
                <a className={classes} href={href} aria-current={current} {...anchor}>
                  {label}
                </a>
              ) : (
                <span className={`${classes} ${styles.text}`} aria-current={current}>
                  {label}
                </span>
              )}
            </li>,
          ];
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
