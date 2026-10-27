import type { HTMLAttributes } from 'react';
import styles from './ChipGroup.module.css';
import '../../styles/tokens.css';

export type ChipGroupProps = HTMLAttributes<HTMLDivElement>;

/**
 * Impact DS Chip group — converted from the Figma "Chip group" component
 * (node 9587:4156): a wrapping row of chips with 8px between them in both
 * directions (spacing/button/2xs). The group only lays the chips out; which
 * chips are selected, and whether one or many can be, is up to the app.
 */
export function ChipGroup({ className, children, ...rest }: ChipGroupProps) {
  return (
    <div role="group" className={[styles.group, className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

export default ChipGroup;
