import { Children, useId } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './AccordionList.module.css';
import { AccordionListContext } from '../Accordion/Accordion';
import { Divider } from '../Divider/Divider';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface AccordionListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The headline above the items (Figma "How we help"). Leave it out for a list without one. */
  title?: ReactNode;
  /** The accordions (Figma `Items` slot). A divider is drawn between neighbours. */
  children?: ReactNode;
}

const present = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Impact DS Accordion list — converted from the Figma "Accordion list"
 * component (node 9587:6366 in the SMAL Impact Design System (Public) Figma
 * file). A card that holds a headline, a divider and a stack of Accordions
 * with a divider between each two. The Accordions inside it switch to the
 * list's look (the Figma "Features" items): no fill of their own, no side
 * padding, a 2XL headline.
 */
export function AccordionList({ title, children, className, ...rest }: AccordionListProps) {
  const titleId = useId();
  const titled = present(title);
  const classes = [styles.list, className].filter(Boolean).join(' ');
  const items = Children.toArray(children).flatMap((item, index) => [
    ...(index > 0 ? [<Divider key={`divider-${index}`} className={styles.divider} aria-hidden />] : []),
    item,
  ]);

  return (
    <AccordionListContext.Provider value={true}>
      <div
        className={classes}
        role={titled ? 'group' : undefined}
        aria-labelledby={titled ? titleId : undefined}
        {...rest}
      >
        <div className={styles.items}>
          {titled && (
            <div className={styles.headline}>
              <div id={titleId} className={styles.title}>
                {title}
              </div>
              <Divider className={styles.divider} aria-hidden />
            </div>
          )}
          {items}
        </div>
      </div>
    </AccordionListContext.Provider>
  );
}

export default AccordionList;
