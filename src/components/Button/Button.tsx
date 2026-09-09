import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
import { Icon } from '../Icon';
import './tokens.css';

export type ButtonHierarchy = 'Primary' | 'Secondary' | 'Tertiary';
export type ButtonSize = 'M' | 'L';
export type ButtonIcon = 'False' | 'Leading' | 'Trailing' | 'Only';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  hierarchy?: ButtonHierarchy;
  size?: ButtonSize;
  icon?: ButtonIcon;
  iconElement?: ReactNode;
  children?: ReactNode;
}

/**
 * Impact DS Button — converted from the Figma "Base/Button" component
 * (node 2767:7590 in the SMAL Impact Design System file).
 * Supports 3 hierarchies x 2 sizes x 4 icon layouts x idle/hover/disabled states.
 *
 * Icon is an inline SVG (see ../Icon) using stroke="currentColor", so it always
 * matches the button's text color automatically — no separate colored assets
 * or CSS masking needed.
 */
export function Button({
  hierarchy = 'Primary',
  size = 'M',
  icon: iconLayout = 'False',
  iconElement,
  children = 'Button',
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const iconPositionClass =
    iconLayout === 'Only'
      ? styles['icon-only']
      : iconLayout === 'Leading'
        ? styles['icon-leading']
        : iconLayout === 'Trailing'
          ? styles['icon-trailing']
          : '';

  const classes = [
    styles.button,
    styles[hierarchy.toLowerCase()],
    styles[`size-${size.toLowerCase()}`],
    iconPositionClass,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'L' ? 32 : 24;
  const iconNode = iconElement ?? <Icon size={iconSize} />;

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {(iconLayout === 'Leading' || iconLayout === 'Only') && iconNode}
      {iconLayout !== 'Only' && <span>{children}</span>}
      {iconLayout === 'Trailing' && iconNode}
    </button>
  );
}

export default Button;
