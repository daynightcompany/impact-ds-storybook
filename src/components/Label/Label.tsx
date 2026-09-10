import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Label.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';

export type LabelSize = 'S' | 'M';

export interface LabelProps extends HTMLAttributes<HTMLSpanElement> {
  size?: LabelSize;
  icon?: boolean;
  iconElement?: ReactNode;
  children?: ReactNode;
}

export function Label({
  size = 'S',
  icon = false,
  iconElement,
  children = 'Label',
  className,
  ...rest
}: LabelProps) {
  const classes = [
    styles.label,
    styles[`size-${size.toLowerCase()}`],
    icon ? styles['has-icon'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = size === 'M' ? 32 : 24;

  return (
    <span className={classes} {...rest}>
      <span>{children}</span>
      {icon && (iconElement ?? <Icon size={iconSize} />)}
    </span>
  );
}

export default Label;
