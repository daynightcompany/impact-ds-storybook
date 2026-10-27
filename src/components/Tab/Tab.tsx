import { useContext } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import styles from './Tab.module.css';
import { Icon } from '../Icon';
import { TabContext } from './TabContext';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Primary = underlined text tab, Secondary = filled pill. */
export type TabVariant = 'Primary' | 'Secondary';
/**
 * Figma size ladder (Desktop height): L = 56px (40px on Mobile), XL = 64px
 * (48px on Mobile). Mobile values come from the breakpoint tokens, not from a
 * prop.
 */
export type TabSize = 'L' | 'XL';
export type TabIcon = 'False' | 'Leading' | 'Trailing' | 'Only';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Defaults to the variant of the surrounding TabList, else Primary. */
  variant?: TabVariant;
  /** Defaults to the size of the surrounding TabList, else L. */
  size?: TabSize;
  icon?: TabIcon;
  /** Replaces the placeholder icon. */
  iconElement?: ReactNode;
  /**
   * Figma Condition. Inside a TabList the list's `value` decides instead,
   * by matching it against this tab's `value`.
   */
  selected?: boolean;
  /** Identifies the tab inside a TabList. */
  value?: string;
  children?: ReactNode;
}

/**
 * Impact DS Tab — converted from the Figma "Tab/Primary" (node 9587:4270) and
 * "Tab/Secondary" (node 9587:4499) component sets, built on "Base/Tab/Primary"
 * 9587:4194 and "Base/Tab/Secondary" 9587:4432. 2 variants x 2 sizes x 4 icon
 * layouts x Unselected/Selected x idle/hover/disabled.
 *
 * Primary: unselected tabs sit at 50% opacity and come to full opacity on
 * hover; the selected tab has a 2px bottom stroke. Secondary: unselected tabs
 * are text only and fill on hover; the selected tab is a filled pill with a
 * ring. Hover is CSS, Disabled is the native `disabled` attribute.
 *
 * Put tabs in a <TabList> to get the tab semantics (roles, selection, arrow
 * keys). A Tab on its own is a plain toggle button.
 */
export function Tab({
  variant,
  size,
  icon = 'False',
  iconElement,
  selected: selectedProp,
  value,
  children = 'Tab',
  className,
  disabled,
  onClick,
  ...rest
}: TabProps) {
  const list = useContext(TabContext);
  const resolvedVariant = variant ?? list?.variant ?? 'Primary';
  const resolvedSize = size ?? list?.size ?? 'L';
  const selected =
    list && list.value !== undefined && value !== undefined ? list.value === value : Boolean(selectedProp);

  const classes = [
    styles.tab,
    styles[resolvedVariant.toLowerCase()],
    styles[`size-${resolvedSize.toLowerCase()}`],
    styles[`icon-${icon.toLowerCase()}`],
    selected && styles.selected,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented && list && value !== undefined) list.select(value);
  };

  // The box is sized by CSS tokens (see .icon in Tab.module.css); the
  // number is only the glyph's intrinsic size before CSS applies.
  const iconSize = resolvedSize === 'XL' ? 32 : 24;
  const iconNode = <span className={styles.icon}>{iconElement ?? <Icon size={iconSize} fixedStroke />}</span>;

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={handleClick}
      {...(list
        ? {
            role: 'tab',
            'aria-selected': selected,
            // Roving tabindex: only the selected tab is in the tab order.
            tabIndex: selected || list.value === undefined ? 0 : -1,
          }
        : { 'aria-pressed': selectedProp })}
      {...rest}
    >
      {(icon === 'Leading' || icon === 'Only') && iconNode}
      {icon !== 'Only' && <span className={styles.label}>{children}</span>}
      {icon === 'Trailing' && iconNode}
    </button>
  );
}

export default Tab;
