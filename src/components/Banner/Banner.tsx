import { isValidElement } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import styles from './Banner.module.css';
import { Button, type ButtonHierarchy } from '../Button/Button';
import { Icon } from '../Icon';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/**
 * The Figma "Button" property, which names the layout of the banner:
 * - `Icon`         title, text and a close icon
 * - `Ghost`        title, text and a Tertiary button
 * - `Prim & Sec`   title, text, a Secondary and a Primary button
 * - `None`         one slim line of text with a link and a close icon
 * - `Primary`      a coloured bar with a large text and a Primary button
 */
export type BannerButton = 'None' | 'Icon' | 'Ghost' | 'Prim & Sec' | 'Primary';

/**
 * An action slot. `true` shows the default of the layout, a string is its label,
 * any node replaces it (give a button `size="L"` so it matches), `false` hides it.
 */
export type BannerAction = boolean | ReactNode;

export interface BannerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Figma "Button": the layout of the banner. */
  button?: BannerButton;
  /**
   * The title. Figma "Title" is on in the `Icon`, `Ghost` and `Prim & Sec`
   * layouts and off in `None` and `Primary`, which have no room for it.
   */
  title?: ReactNode;
  /** Figma boolean "Close button" (the `Icon` and `None` layouts). */
  closeButton?: boolean;
  /** Called by the close button. The banner does not hide itself. */
  onClose?: () => void;
  /** Accessible name of the close button. */
  closeLabel?: string;
  /** The `Ghost` layout's button, Tertiary. */
  tertiaryButton?: BannerAction;
  /** The `Prim & Sec` layout's Secondary button. */
  secondaryButton?: BannerAction;
  /** The Primary button of the `Prim & Sec` and `Primary` layouts. */
  primaryButton?: BannerAction;
  /** The link at the end of the text of the `None` layout. */
  link?: BannerAction;
  /** The text of the banner (the Figma description or message). */
  children?: ReactNode;
}

const DEFAULT_TEXT: Record<BannerButton, string> = {
  Icon: 'Pull request #9999 merged after a successful build',
  Ghost: 'Pull request #9999 merged after a successful build',
  'Prim & Sec': 'Pull request #9999 merged after a successful build',
  None: 'Your email is not verified. Verify to enable withdrawals.',
  Primary: 'Want to find out more about our revolutionary solar and storage technology?',
};

function renderButton(
  value: BannerAction | undefined,
  fallback: string,
  hierarchy: ButtonHierarchy,
): ReactNode {
  if (value === false || value === null) return null;
  if (value === undefined || value === true) {
    return (
      <Button hierarchy={hierarchy} size="L">
        {fallback}
      </Button>
    );
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <Button hierarchy={hierarchy} size="L">
        {value}
      </Button>
    );
  }
  return isValidElement(value) ? value : <>{value}</>;
}

/**
 * Impact DS Banner — converted from the Figma "Banner" component set (node
 * 9587:6765) in the SMAL Impact Design System file. A message bar in five
 * layouts, named by the Figma property Button: Icon, Ghost, Prim & Sec, None
 * and Primary. The first three are white cards (corner radius s) with a bold
 * title and a text; they differ in what sits at the end: a close icon, a
 * Tertiary button, or a Secondary and a Primary button. `None` is one slim line
 * of small text with a link and a close icon. `Primary` is a full-width bar in
 * the orange of the brand with a large text and a Primary button, and no
 * rounded corners.
 *
 * Responsive like the Figma auto layout: the text takes the room the buttons
 * leave and the buttons drop under it when it would get narrower than its
 * minimum width (272, 300 for `Primary`), so on a phone the buttons are under
 * the text. Padding, gaps and the buttons follow the breakpoint tokens. The
 * banner is a plain block: it fills the width it is in, does not hide itself
 * and has no role; give it `role="status"` (or `alert`) when it appears after
 * the page has loaded.
 *
 * The two buttons of `Prim & Sec` are as wide as their labels, at the end of the
 * banner. When the banner is narrower than the two of them they stack over its
 * full width with the Primary on top, like the buttons of the Card with icons
 * and the Cookie banner.
 */
export function Banner({
  button = 'Icon',
  title = 'Merged pull request',
  closeButton = true,
  onClose,
  closeLabel = 'Close',
  tertiaryButton,
  secondaryButton,
  primaryButton,
  link,
  children,
  className,
  ...rest
}: BannerProps) {
  const classes = [styles.banner, styles[button.toLowerCase().replace(/[^a-z]+/g, '-')], className]
    .filter(Boolean)
    .join(' ');
  const text = children ?? DEFAULT_TEXT[button];

  const close = (
    <Button
      type="button"
      hierarchy="Tertiary"
      size="M"
      icon="Only"
      iconElement={<Icon name="x" size={24} />}
      className={styles.close}
      aria-label={closeLabel}
      onClick={onClose}
    />
  );

  if (button === 'None') {
    const linkNode =
      link === false || link === null
        ? null
        : link === undefined || link === true || typeof link === 'string' ? (
            <button type="button" className={styles.link}>
              {typeof link === 'string' ? link : 'Resend verification link to email ›'}
            </button>
          ) : (
            link
          );
    return (
      <div className={classes} {...rest}>
        <div className={styles.line}>
          <span className={styles.message}>{text}</span>
          {linkNode}
        </div>
        {closeButton && close}
      </div>
    );
  }

  if (button === 'Primary') {
    return (
      <div className={classes} {...rest}>
        <p className={styles.promo}>{text}</p>
        {renderButton(primaryButton, 'Button', 'Primary')}
      </div>
    );
  }

  return (
    <div className={classes} {...rest}>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{text}</p>
      </div>
      {button === 'Icon' && closeButton && close}
      {button === 'Ghost' && renderButton(tertiaryButton, 'Discard', 'Tertiary')}
      {button === 'Prim & Sec' && (
        <div className={styles.buttons}>
          {renderButton(secondaryButton, 'Discard', 'Secondary')}
          {renderButton(primaryButton, 'View commit', 'Primary')}
        </div>
      )}
    </div>
  );
}

export default Banner;
