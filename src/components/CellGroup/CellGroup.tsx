import { Children, useId, useState } from 'react';
import type { HTMLAttributes } from 'react';
import styles from './CellGroup.module.css';
import { CellGroupContext, type CellGroupType } from './CellGroupContext';
import { Divider } from '../Divider/Divider';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export type { CellGroupType };

export interface CellGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /**
   * Figma Type: the kind of row the group holds. Link groups hold <CellList>
   * rows; Radio, Switch and Checkbox groups hold <CellSelector> rows.
   */
  type?: CellGroupType;
  /** Radio groups: the selected row (controlled). Matches a row's `value`. */
  value?: string;
  /** Radio groups: the initially selected row (uncontrolled). */
  defaultValue?: string;
  /** Radio groups: called with the `value` of the row the user picked. */
  onValueChange?: (value: string) => void;
  /** Radio groups: form field name shared by the rows. Generated when left out. */
  name?: string;
}

/**
 * Impact DS Cell group — converted from the Figma "Cell group" component set
 * (node 9587:5878): a vertical stack of cells with a Divider between them and
 * 8px (spacing/2xs) above and below each Divider. Type Link / Radio / Switch /
 * Checkbox; the Items slot is the children.
 *
 * Dividers are added between the children for you. A Link group is a list; a
 * Radio group is a radio group whose rows share one name, so Tab enters it once
 * and the arrow keys move and select. Give the group an `aria-label`.
 */
export function CellGroup({
  type = 'Link',
  value: valueProp,
  defaultValue,
  onValueChange,
  name,
  className,
  children,
  ...rest
}: CellGroupProps) {
  const generatedName = useId();
  const [inner, setInner] = useState(defaultValue);
  const controlled = valueProp !== undefined;
  const value = controlled ? valueProp : inner;

  const select = (next: string) => {
    if (!controlled) setInner(next);
    onValueChange?.(next);
  };

  const rows = Children.toArray(children);
  const role = type === 'Link' ? 'list' : type === 'Radio' ? 'radiogroup' : 'group';

  return (
    <CellGroupContext.Provider value={{ type, name: name ?? generatedName, value, select }}>
      <div role={role} className={[styles.group, className].filter(Boolean).join(' ')} {...rest}>
        {rows.map((row, index) => (
          <div key={index} role={type === 'Link' ? 'listitem' : undefined} className={styles.row}>
            {row}
            {index < rows.length - 1 && <Divider aria-hidden />}
          </div>
        ))}
      </div>
    </CellGroupContext.Provider>
  );
}

export default CellGroup;
