import type { ReactNode } from 'react';
import { Button, type ButtonHierarchy, type ButtonIcon, type ButtonSize } from './Button/Button';

/**
 * A text slot of the text blocks, for a Figma boolean that shows a line of
 * text: `true` shows the default text, `false` hides it, a string or a node
 * replaces it.
 */
export type TextSlot = boolean | ReactNode;

export function textSlot(value: TextSlot | undefined, fallback: ReactNode): ReactNode {
  if (value === false || value === null) return null;
  if (value === undefined || value === true) return fallback;
  return value;
}

/**
 * A line of a text block: a paragraph for a string, a plain box for anything
 * else (a heading, a link), so no block lands inside a paragraph.
 */
export function TextPart({ className, children }: { className: string; children: ReactNode }) {
  return typeof children === 'string' || typeof children === 'number' ? (
    <p className={className}>{children}</p>
  ) : (
    <div className={className}>{children}</div>
  );
}

/**
 * A button slot of the text blocks: `true` shows the default button, a string
 * is its label, a node replaces it (give a button the same size), `false`
 * hides it.
 */
export type ButtonSlot = boolean | ReactNode;

export function buttonSlot(
  value: ButtonSlot | undefined,
  defaults: { label: string; hierarchy: ButtonHierarchy; size: ButtonSize; icon?: ButtonIcon; onClick?: () => void },
): ReactNode {
  if (value === false || value === null) return null;
  if (value === undefined || value === true || typeof value === 'string' || typeof value === 'number') {
    return (
      <Button hierarchy={defaults.hierarchy} size={defaults.size} icon={defaults.icon} onClick={defaults.onClick}>
        {value === undefined || value === true ? defaults.label : value}
      </Button>
    );
  }
  return value;
}
