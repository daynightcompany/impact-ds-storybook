import { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import styles from './Radiobutton.module.css';
import '../../styles/tokens.css';

export interface RadiobuttonProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Whether to show the text label — matches Figma's own `label` boolean prop. */
  label?: boolean;
  children?: ReactNode;
}

/**
 * Impact DS Radiobutton — converted from the Figma "Radiobutton" component
 * (node 3386:13813). Same accessible pattern and prop shape as Checkbox.
 *
 * The selected marker is a plain ring (2px stroke), not a checkmark —
 * Figma's own "check-alternative" glyph on this component is set to
 * visible:false, confirmed directly on the node.
 */
export function Radiobutton({ label = true, children = 'Label', className, id, ...rest }: RadiobuttonProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={[styles.root, className].filter(Boolean).join(' ')}>
      <input id={inputId} type="radio" className={styles.input} {...rest} />
      <span className={styles.box} aria-hidden="true">
        <span className={styles.fill} />
        <svg
          viewBox="0 0 16 16"
          width={16}
          height={16}
          fill="none"
          className={styles.dot}
        >
          <path
            d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
            stroke="currentColor"
            strokeWidth={2}
          />
        </svg>
      </span>
      {label && <span className={styles.label}>{children}</span>}
    </label>
  );
}

export default Radiobutton;
