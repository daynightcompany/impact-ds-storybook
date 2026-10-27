import type { HTMLAttributes, ReactNode } from 'react';
import styles from './DialogHeader.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface DialogHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
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
   * Figma boolean "Right icons": the close button (`onClose`) and, next to it,
   * the additional icons. Turning it off hides both, as in Figma.
   */
  rightIcons?: boolean;
  /**
   * Figma boolean "Additional icons" (shown only with `rightIcons`). `true`
   * shows two placeholder icons; pass a node to fill the Figma "Additional
   * icons content" slot.
   */
  additionalIcons?: boolean | ReactNode;
  /** Called by the back arrow. */
  onBack?: () => void;
  /** Called by the close button. */
  onClose?: () => void;
  /** Accessible name of the back arrow. */
  backLabel?: string;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** Id for the title element, so a dialog can point `aria-labelledby` at it. */
  titleId?: string;
}

/**
 * Impact DS Dialog header — converted from the Figma "Dialog/Header" component
 * (node 9587:6860): left icons, a centred title and right icons with a close
 * button, 16px around and between (spacing/s). Four booleans (Left icons,
 * Title, Right icons, Additional icons) and three slots.
 *
 * The title takes the space the two icon groups leave: both groups grow
 * equally, so it stays centred while the left icons are shown and sits at the
 * start when they are not. Inside a Dialog or Popup the padding is overridden
 * through `--dialog-header-padding`, like the instance override in Figma.
 */
export function DialogHeader({
  title = 'Title',
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
}: DialogHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      <div className={styles.container}>
        {leftIcons && (
          <div className={styles.left}>
            {leftIcons === true ? (
              <button type="button" className={styles.iconButton} aria-label={backLabel} onClick={onBack}>
                <Icon name="arrow-left" size={24} />
              </button>
            ) : (
              leftIcons
            )}
          </div>
        )}
        {showTitle && (
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
        )}
        {rightIcons && (
          <div className={styles.right}>
            {additionalIcons && (
              <div className={styles.additional}>
                {additionalIcons === true ? (
                  <>
                    <span className={styles.placeholder} aria-hidden>
                      <Icon name="placeholder" size={24} />
                    </span>
                    <span className={styles.placeholder} aria-hidden>
                      <Icon name="placeholder" size={24} />
                    </span>
                  </>
                ) : (
                  additionalIcons
                )}
              </div>
            )}
            <button type="button" className={styles.iconButton} aria-label={closeLabel} onClick={onClose}>
              <Icon name="x" size={24} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DialogHeader;
