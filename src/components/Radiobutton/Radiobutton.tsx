import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radiobutton.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';

export interface RadiobuttonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  children?: ReactNode;
}

export function Radiobutton({ children, className, id, ...rest }: RadiobuttonProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <input id={inputId} type="radio" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.fill} />
        <Icon size={16} className={styles.dot} />
      </span>
      {children != null && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export default Radiobutton;
