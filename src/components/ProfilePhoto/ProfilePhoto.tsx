import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import styles from './ProfilePhoto.module.css';
import { Avatar, type AvatarType } from '../Avatar/Avatar';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma Adjustment: the badge shows `+` (add a photo) or a pencil (change it). */
export type ProfilePhotoAdjustment = 'add' | 'edit';

export interface ProfilePhotoProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> {
  adjustment?: ProfilePhotoAdjustment;
  /**
   * Figma State=pressed. The button shows this by itself while it is held
   * down; set it to show the pressed look statically.
   */
  pressed?: boolean;
  /** What the round photo shows: the account icon, initials or an image. */
  type?: AvatarType;
  /** Image type: the photo. */
  src?: string;
  /** Image type: alternative text for `src`. */
  alt?: string;
  /** Diameter in px; Figma draws it at 100. The badge keeps its 24px size. */
  size?: number;
  /** Initials, or a replacement for the default icon / photo (see Avatar). */
  children?: ReactNode;
}

/**
 * Impact DS Profile photo — converted from the Figma "Profile Photo" component
 * set (node 9587:3436): a 100px Avatar with a 24px round action badge at its
 * bottom-right corner. Adjustment add / edit x State default / pressed.
 *
 * The whole thing is one button (give it an `aria-label`, e.g. "Change profile
 * photo"). Pressing it greys the avatar like the Avatar's own Pressed state and
 * moves the badge to the hover colour.
 */
export function ProfilePhoto({
  adjustment = 'add',
  pressed,
  type = 'Icon',
  src,
  alt,
  size = 100,
  children,
  className,
  style,
  ...rest
}: ProfilePhotoProps) {
  const classes = [styles.root, pressed && styles.pressed, className].filter(Boolean).join(' ');
  const rootStyle = { '--profile-size': `${size}px`, ...style } as CSSProperties;

  return (
    <button type="button" className={classes} style={rootStyle} {...rest}>
      <Avatar className={styles.avatar} type={type} src={src} alt={alt} size={size}>
        {children}
      </Avatar>
      <span className={styles.badge} aria-hidden>
        <Icon name={adjustment === 'edit' ? 'edit' : 'plus'} size={16} />
      </span>
    </button>
  );
}

export default ProfilePhoto;
