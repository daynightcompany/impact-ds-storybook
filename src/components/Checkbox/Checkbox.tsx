import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Checkbox.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  children?: ReactNode;
}

export function Checkbox({ children, className, id, ...rest }: CheckboxProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <input id={inputId} type="checkbox" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.fill} />
        <Icon size={16} className={styles.check} />
      </span>
      {children != null && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export default Checkbox;
