import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';
import styles from './Avatar.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * - `Icon`      the account glyph
 * - `Initials`  one or two letters (pass them as `children`)
 * - `Image`     the grey picture placeholder
 */
export type AvatarType = 'Icon' | 'Initials' | 'Image';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  type?: AvatarType;
  /**
   * Diameter in px. Figma draws the Avatar at 40; the Profile photo scales it
   * to 100. The content (24px icon, 16px initials) keeps its size either way.
   */
  size?: number;
  /** Figma Selected: a 2px ring in the primary interactive colour. */
  selected?: boolean;
  /**
   * Figma State=Pressed. An avatar with an `onClick` shows this by itself
   * under the pointer and while it is held down (the Figma prototype goes to
   * Pressed on hover and on press); set it to show the pressed look statically.
   */
  pressed?: boolean;
  /**
   * The content of the avatar: the initials for the Initials type, or a
   * replacement for the default icon (Icon type). The Image type is always
   * the placeholder.
   */
  children?: ReactNode;
}

/** The 12 x 9 glyph that sits on the grey Image placeholder (Image/Thumbnail). */
function ImageGlyph() {
  return (
    <svg width="12" height="9" viewBox="0 0 12 9" fill="currentColor" aria-hidden>
      <circle cx="3.09" cy="1.29" r="1.29" />
      <path d="M12 9H0L3.1257 3.6142L4.4707 5.7364L7.0865 1.2047L12 9Z" />
    </svg>
  );
}

/**
 * Impact DS Avatar — converted from the Figma "Avatar" component set (node
 * 9587:3379) in the SMAL Impact Design System file. Type (Icon / Initials /
 * Image) x Selected x State (Default / Pressed).
 *
 * A round, 1px outlined badge. Pressed greys the fill (a tint over the Image
 * placeholder) and drops the outline, Selected swaps the outline for a 2px
 * ring. The Figma prototype goes to Pressed on hover as well as on press, so an
 * avatar with an `onClick` (it renders as a button) shows the Pressed look
 * under the pointer and while it is held down, easing in over 300ms (50ms for
 * the press itself); without an `onClick` it is a plain, non-interactive
 * element. Keep `selected` in your own state and flip it in the `onClick`: a
 * button with `selected` set is announced as a toggle.
 *
 * Colours are driven by custom properties on the root, which a parent can
 * override for a composite (see Profile photo): `--avatar-fill`,
 * `--avatar-stroke-w`, `--avatar-stroke-c` and `--avatar-tint`.
 */
export function Avatar({
  type = 'Icon',
  size = 40,
  selected,
  pressed,
  children,
  className,
  style,
  onClick,
  ...rest
}: AvatarProps) {
  const interactive = onClick !== undefined;

  const classes = [
    styles.avatar,
    styles[`type-${type.toLowerCase()}`],
    selected && styles.selected,
    pressed && styles.pressed,
    interactive && styles.interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  let content: ReactNode;
  if (type === 'Initials') {
    content = <span className={styles.initials}>{children ?? 'AB'}</span>;
  } else if (type === 'Image') {
    content = (
      <span className={styles.placeholder}>
        <ImageGlyph />
      </span>
    );
  } else {
    content = <span className={styles.glyph}>{children ?? <Icon name="account" />}</span>;
  }

  const rootStyle = { '--avatar-size': `${size}px`, ...style } as CSSProperties;

  if (interactive) {
    return (
      <button
        type="button"
        className={classes}
        style={rootStyle}
        aria-pressed={selected}
        onClick={onClick}
        {...(rest as HTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={classes}
      style={rootStyle}
      role={rest['aria-label'] ? 'img' : undefined}
      {...rest}
    >
      {content}
    </span>
  );
}

export default Avatar;
