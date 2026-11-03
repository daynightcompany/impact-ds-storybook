import { createContext, useContext, useId, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Accordion.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * Set by the Secondary `AccordionList`: an Accordion inside it is drawn the way
 * the Figma "Accordion list" draws its `Features` items (no fill, no side
 * padding, a 2XL headline). The Primary list leaves it off.
 */
export const AccordionListContext = createContext(false);

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** The headline in the header (Figma `Headline`). */
  title: ReactNode;
  /**
   * Figma `Expanded`. Set it to control the accordion from outside and listen
   * to `onExpandedChange` to hear the clicks; leave it out to let the accordion
   * keep its own state.
   */
  expanded?: boolean;
  /** Whether it starts open when it keeps its own state. */
  defaultExpanded?: boolean;
  /** Called with the new state when the header is clicked. */
  onExpandedChange?: (expanded: boolean) => void;
  /** Figma `Body text`: the paragraph in the panel. Shown when you pass it. */
  bodyText?: ReactNode;
  /** Figma `Quote`: the serif line under the body text. Shown when you pass it. */
  quote?: ReactNode;
  /** The image or video in the panel (Figma's `image-placeholder`). It gets the full width and rounded corners. */
  media?: ReactNode;
  /** Level of the heading around the header button, so the accordion fits the outline of the page. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
}

const present = (node: ReactNode) => node !== undefined && node !== null && node !== false && node !== '';

/**
 * Impact DS Accordion — converted from the Figma "Accordion" component set
 * (node 9587:6333 in the SMAL Impact Design System (Public) Figma file). A
 * header with a plus (a minus when open) that opens a panel with body text, a
 * quote and an image. Closed it is a pill, open a card with a smaller radius.
 * The header is a real button (`aria-expanded`, `aria-controls`) inside a
 * heading, and the panel a labelled region.
 */
export function Accordion({
  title,
  expanded: expandedProp,
  defaultExpanded = false,
  onExpandedChange,
  bodyText,
  quote,
  media,
  headingLevel = 3,
  className,
  ...rest
}: AccordionProps) {
  const inList = useContext(AccordionListContext);
  const [ownExpanded, setOwnExpanded] = useState(defaultExpanded);
  const controlled = expandedProp !== undefined;
  const expanded = controlled ? expandedProp : ownExpanded;
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const classes = [styles.accordion, inList && styles.list, className].filter(Boolean).join(' ');

  const toggle = () => {
    const next = !expanded;
    if (!controlled) setOwnExpanded(next);
    onExpandedChange?.(next);
  };

  return (
    <div className={classes} data-expanded={expanded} {...rest}>
      <Heading className={styles.heading}>
        <button
          type="button"
          id={headerId}
          className={styles.trigger}
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={toggle}
        >
          <span className={styles.title}>{title}</span>
          <span className={styles.icon}>
            <Icon name={expanded ? 'minus' : 'plus'} size={32} fixedStroke />
          </span>
        </button>
      </Heading>
      <div id={panelId} role="region" aria-labelledby={headerId} className={styles.panel}>
        <div className={styles.clip}>
          <div className={styles.content}>
            {(present(bodyText) || present(quote)) && (
              <div className={styles.body}>
                {present(bodyText) && <div className={styles['body-text']}>{bodyText}</div>}
                {present(quote) && <div className={styles.quote}>{quote}</div>}
              </div>
            )}
            {present(media) && <div className={styles.media}>{media}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Accordion;
