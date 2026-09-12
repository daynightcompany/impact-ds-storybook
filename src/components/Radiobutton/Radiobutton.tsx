import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radiobutton.module.css';
import { Icon } from '../Icon';
import '../../styles/tokens.css';

export interface RadiobuttonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Whether to show the text label — matches Figma's own `label` boolean prop. */
  label?: boolean;
  children?: ReactNode;
}

/**
 * Impact DS Radiobutton — converted from the Figma "Radiobutton" component
 * (node 3386:13813). Same accessible pattern and prop shape as Checkbox.
 */
export function Radiobutton({ label = true, children = 'Label', className, id, ...rest }: RadiobuttonProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <input id={inputId} type="radio" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.fill} />
        <Icon size={16} className={styles.dot} />
      </span>
      {label && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export default Radiobutton;
