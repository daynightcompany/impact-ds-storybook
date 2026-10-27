import { useContext, useId } from 'react';
import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import styles from './CellSelector.module.css';
import { Checkbox } from '../Checkbox/Checkbox';
import { Radiobutton } from '../Radiobutton/Radiobutton';
import { Switch } from '../Switch/Switch';
import { Icon } from '../Icon';
import { CellGroupContext } from '../CellGroup/CellGroupContext';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma Selector: the control on the right of the row. */
export type CellSelectorKind = 'check' | 'radio' | 'switch';

export interface CellSelectorProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'title' | 'children'> {
  /**
   * Figma Selector. Inside a <CellGroup> it defaults to the group's kind
   * (Radio, Switch or Checkbox); on its own it defaults to `switch`.
   */
  selector?: CellSelectorKind;
  /** The title; Figma shows "Title". */
  children?: ReactNode;
  /** Figma Subtitle=True: a second line under the title. */
  subtitle?: ReactNode;
  /** Figma "Show icon". */
  showIcon?: boolean;
  /** Replaces the placeholder icon. */
  icon?: ReactNode;
}

const KIND_OF_GROUP = { Radio: 'radio', Switch: 'switch', Checkbox: 'check', Link: undefined } as const;

/**
 * Impact DS Cell selector — converted from the Figma "cell selector" component
 * set (node 9587:5668): a row with an optional 24px icon, a title (and
 * optional subtitle) and a Checkbox, Radiobutton or Switch on the right.
 * Selector (check / radio / switch) x Subtitle x Selected; "Show icon" is a
 * boolean. Selected is the control's checked state, so use `checked` /
 * `defaultChecked` / `onChange` as on the control itself.
 *
 * The row is 48px tall (64px with a subtitle) at Desktop and takes the width
 * of its container. The whole row is the click target: the control's label is
 * stretched over it, and the title names the input for assistive tech.
 *
 * In a Radio <CellGroup> the group owns the selection: give each row a `value`.
 */
export function CellSelector({
  selector,
  children = 'Title',
  subtitle,
  showIcon = true,
  icon,
  className,
  disabled,
  checked,
  defaultChecked,
  onChange,
  value,
  name,
  ...rest
}: CellSelectorProps) {
  const group = useContext(CellGroupContext);
  const titleId = useId();
  const subtitleId = useId();

  const kind: CellSelectorKind = selector ?? (group ? KIND_OF_GROUP[group.type] : undefined) ?? 'switch';

  // A radio inside a Radio group is controlled by the group.
  const inRadioGroup = group?.type === 'Radio' && kind === 'radio' && value !== undefined;
  const inputProps = {
    ...rest,
    disabled,
    value,
    name: name ?? (inRadioGroup ? group.name : undefined),
    'aria-labelledby': titleId,
    'aria-describedby': subtitle != null ? subtitleId : undefined,
    ...(inRadioGroup
      ? {
          checked: group.value === value,
          onChange: (event: ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
            if (!event.defaultPrevented) group.select(String(value));
          },
        }
      : { checked, defaultChecked, onChange }),
  };

  const classes = [
    styles.cell,
    subtitle != null && styles.hasSubtitle,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {showIcon && <span className={styles.icon}>{icon ?? <Icon />}</span>}
      <span className={styles.text}>
        <span id={titleId} className={styles.title}>
          {children}
        </span>
        {subtitle != null && (
          <span id={subtitleId} className={styles.subtitle}>
            {subtitle}
          </span>
        )}
      </span>
      <span className={styles.selector}>
        {kind === 'switch' && <Switch size="M" className={styles.control} {...inputProps} />}
        {kind === 'radio' && <Radiobutton label={false} className={styles.control} {...inputProps} />}
        {kind === 'check' && <Checkbox label={false} className={styles.control} {...inputProps} />}
      </span>
    </div>
  );
}

export default CellSelector;
