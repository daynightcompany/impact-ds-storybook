import type { HTMLAttributes, ReactNode } from 'react';
import styles from './NavigationPage.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface NavigationPageProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title text (the Figma "Title content" slot). */
  title?: ReactNode;
  /** Figma boolean "Title". */
  showTitle?: boolean;
  /**
   * Figma boolean "Left icons". `true` shows a back arrow (`onBack`); pass a
   * node to fill the Figma "Left icon content" slot with your own icons.
   */
  leftIcons?: boolean | ReactNode;
  /**
   * Figma boolean "Right icons": the close icon (`onClose`) and, next to it,
   * the additional icons. Turning it off hides both, as in Figma.
   */
  rightIcons?: boolean;
  /**
   * Figma boolean "Additional icons" (shown only with `rightIcons`). `true`
   * shows a placeholder icon; pass a node to fill the Figma "Additional icons
   * content" slot.
   */
  additionalIcons?: boolean | ReactNode;
  /** Called by the back arrow. */
  onBack?: () => void;
  /** Called by the close icon. */
  onClose?: () => void;
  /** Accessible name of the back arrow. */
  backLabel?: string;
  /** Accessible name of the close icon. */
  closeLabel?: string;
  /** Id for the title element. */
  titleId?: string;
}

/**
 * Impact DS Navigation page — converted from the Figma "Navigation/Page"
 * component (node 9587:6595): the bar of a page on a small screen, on the
 * background colour with spacing/2xs above and below and spacing/s at the
 * sides. Left icons, a centred title and right icons, the same four booleans
 * and three slots as the Dialog header: Left icons, Title, Right icons and
 * Additional icons.
 *
 * The icons are 24 icons here, not Buttons: the back arrow and the close icon
 * are real buttons with the hit area a little larger than they are drawn. The
 * title is the heading of the page (`h1`) in the MD label style, centred while
 * the left icons are shown and at the start when they are not, because both
 * groups grow equally.
 */
export function NavigationPage({
  title = 'Page title',
  showTitle = true,
  leftIcons = true,
  rightIcons = true,
  additionalIcons = true,
  onBack,
  onClose,
  backLabel = 'Back',
  closeLabel = 'Close',
  titleId,
  className,
  ...rest
}: NavigationPageProps) {
  return (
    <div className={[styles.page, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.content}>
        {leftIcons && (
          <div className={styles.left}>
            {leftIcons === true ? (
              <button type="button" className={styles.action} aria-label={backLabel} onClick={onBack}>
                <Icon name="arrow-left" size={24} />
              </button>
            ) : (
              leftIcons
            )}
          </div>
        )}
        {showTitle && (
          <h1 className={styles.title} id={titleId}>
            {title}
          </h1>
        )}
        {rightIcons && (
          <div className={styles.right}>
            {additionalIcons && (
              <div className={styles.additional}>
                {additionalIcons === true ? (
                  <span className={styles.placeholder} aria-hidden>
                    <Icon name="placeholder" size={24} />
                  </span>
                ) : (
                  additionalIcons
                )}
              </div>
            )}
            <button type="button" className={styles.action} aria-label={closeLabel} onClick={onClose}>
              <Icon name="x" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavigationPage;
