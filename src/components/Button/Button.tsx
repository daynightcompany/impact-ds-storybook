import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';
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
 */
export function Button({
  hierarchy = 'Primary',
  size = 'M',
  icon = 'False',
  iconElement,
  children = 'Button',
  className,
  disabled,
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[hierarchy.toLowerCase()],
    styles[`size-${size.toLowerCase()}`],
    icon === 'Only' ? styles['icon-only'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconNode = iconElement ?? (
    <span
      className={[styles.icon, styles[`size-${size.toLowerCase()}`]].join(' ')}
      aria-hidden
      style={{ borderRadius: '50%', background: 'currentColor', opacity: 0.35 }}
    />
  );

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {(icon === 'Leading' || icon === 'Only') && iconNode}
      {icon !== 'Only' && <span>{children}</span>}
      {icon === 'Trailing' && iconNode}
    </button>
  );
}

export default Button;
