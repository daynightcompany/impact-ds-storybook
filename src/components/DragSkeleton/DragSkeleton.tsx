import type { HTMLAttributes, ReactNode } from 'react';
import styles from './DragSkeleton.module.css';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface DragSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Figma `Notification`: the line of text under the handle. */
  notification?: boolean;
  /** The text of the notification line (Figma: "Live Activity"). */
  children?: ReactNode;
}

/**
 * Impact DS Drag skeleton — converted from the Figma "Drag Skeleton"
 * component set (node 9587:6220 in the SMAL Impact Design System (Public)
 * Figma file). The top edge of a sheet that is dragged: a small handle and,
 * with `notification`, a line of text under it. The handle is decoration;
 * the dragging itself belongs to the sheet this sits in.
 */
export function DragSkeleton({
  notification = true,
  children = 'Live Activity',
  className,
  ...rest
}: DragSkeletonProps) {
  return (
    <div className={[styles.skeleton, className].filter(Boolean).join(' ')} {...rest}>
      <span className={styles.handle} aria-hidden />
      {notification && <span className={styles.text}>{children}</span>}
    </div>
  );
}

export default DragSkeleton;
