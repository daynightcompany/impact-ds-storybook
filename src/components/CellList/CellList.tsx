import type { HTMLAttributes, ReactNode } from 'react';
import styles from './CellList.module.css';
import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface CellListProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** The title; Figma shows "Title". */
  children?: ReactNode;
  /** Figma Subtitle=True: a second line under the title. */
  subtitle?: ReactNode;
  /** Figma "Label" boolean: a short text on the right, shown when you pass one. */
  label?: ReactNode;
  /** Figma "Chevron" boolean. */
  chevron?: boolean;
  /** Figma "Icon left" boolean. Hidden when there is an avatar. */
  iconLeft?: boolean;
  /** Replaces the placeholder icon on the left. */
  icon?: ReactNode;
  /**
   * Figma Avatar=True: shows an avatar instead of the icon. `true` gives the
   * default Avatar; pass your own <Avatar> to configure it.
   */
  avatar?: boolean | ReactNode;
  /** Renders a link (<a>) instead of a button. */
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
}

/**
 * Impact DS Cell list — converted from the Figma "cell list" component set
 * (node 9587:5774): a navigation row with an optional 24px icon or 40px
 * avatar, a title (and optional subtitle), an optional label and a chevron.
 * Subtitle x Avatar are variants; Label, Chevron and Icon left are booleans.
 *
 * The row is 48px tall (64px with a subtitle) at Desktop and takes the width
 * of its container. It is a button, or a link when you give it an `href`.
 * Figma has no hover or pressed state for it.
 */
export function CellList({
  children = 'Title',
  subtitle,
  label,
  chevron = true,
  iconLeft = true,
  icon,
  avatar,
  href,
  target,
  rel,
  disabled,
  className,
  ...rest
}: CellListProps) {
  const hasSubtitle = subtitle != null;
  const hasAvatar = Boolean(avatar);

  const classes = [
    styles.cell,
    hasSubtitle && styles.hasSubtitle,
    hasAvatar && styles.hasAvatar,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {hasAvatar ? (
        <span className={styles.avatar}>{avatar === true ? <Avatar /> : avatar}</span>
      ) : (
        iconLeft && <span className={styles.icon}>{icon ?? <Icon />}</span>
      )}
      <span className={styles.text}>
        <span className={styles.title}>{children}</span>
        {hasSubtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </span>
      {label != null && <span className={styles.label}>{label}</span>}
      {chevron && (
        <span className={styles.icon}>
          <Icon name="chevron-right" />
        </span>
      )}
    </>
  );

  if (href !== undefined) {
    return (
      <a
        className={classes}
        href={disabled ? undefined : href}
        target={target}
        rel={rel}
        aria-disabled={disabled || undefined}
        {...(rest as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} disabled={disabled} {...(rest as HTMLAttributes<HTMLButtonElement>)}>
      {content}
    </button>
  );
}

export default CellList;
