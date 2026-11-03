import type { HTMLAttributes, ReactNode } from 'react';
import styles from './NavigationFooter.module.css';
import { Button } from '../Button/Button';
import { Divider } from '../Divider/Divider';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import { DnLogo, ImpactLogo, SmalLogo, SmalMark } from '../Logos';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface NavigationFooterProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * Figma boolean "Upper logo": the logo above the links, drawn 113 wide.
   * `true` shows the Impact DS logo; pass a node to show another logo.
   */
  upperLogo?: boolean | ReactNode;
  /**
   * Figma boolean "Horizontal links", with its content: a row of links that
   * wraps, normally a `TextLinkGroup` of `TextLink`s of size L. Nothing hides it.
   */
  horizontalLinks?: ReactNode;
  /**
   * Figma boolean "Vertical links in columns", with its content: the link
   * groups, normally `TextLinkGroup`s with `orientation="Vertical"` of size M
   * links. They share the width in equal columns, at least 140 wide, and wrap
   * onto more rows when the footer is narrow. Nothing hides them.
   */
  verticalLinksInColumns?: ReactNode;
  /** Figma boolean "Made in SMAL": "White label design system from SMAL & DN" with the two logos. */
  madeInSmal?: boolean;
  /**
   * Figma boolean "Social icons". `true` shows the four social buttons of
   * Figma (Facebook, Instagram, YouTube and LinkedIn: Buttons, Tertiary, size L,
   * icon only, with no destination); pass nodes to show your own links.
   */
  socialIcons?: boolean | ReactNode;
  /** The text at the end of the bottom line, next to the two small logos (Figma: "v2, 2026"). */
  note?: ReactNode;
}

const SOCIAL: { name: IconName; label: string }[] = [
  { name: 'facebook', label: 'Facebook' },
  { name: 'instagram', label: 'Instagram' },
  { name: 'youtube', label: 'YouTube' },
  { name: 'linkedin', label: 'LinkedIn' },
];

/**
 * Impact DS Navigation footer — converted from the Figma "Navigation/Footer"
 * component (node 9587:6637): the page footer on the surface colour, with
 * spacing/2xl above and below and spacing/m at the sides. The top has the
 * logo, a row of links and the link groups in columns (spacing/3xl apart); the
 * bottom, spacing/3xl further down, has the "made in SMAL" line, the social
 * icons and, under a divider, the two small logos with a note at the end. Five
 * booleans: Upper logo, Horizontal links, Vertical links in columns, Made in
 * SMAL and Social icons. Everything is spacing/l, spacing/m or spacing/2xs
 * apart, as in Figma, and the footer is at least 375 wide.
 *
 * A `footer` landmark. The logos are drawn in the paragraph colour, the small
 * ones and the note in the secondary one.
 */
export function NavigationFooter({
  upperLogo = true,
  horizontalLinks,
  verticalLinksInColumns,
  madeInSmal = true,
  socialIcons = true,
  note = 'v2, 2026',
  className,
  ...rest
}: NavigationFooterProps) {
  const hasTop = Boolean(upperLogo || horizontalLinks || verticalLinksInColumns);
  return (
    <footer className={[styles.footer, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.content}>
        {hasTop && (
          <div className={styles.top}>
            {upperLogo && <div className={styles.logo}>{upperLogo === true ? <ImpactLogo /> : upperLogo}</div>}
            {horizontalLinks && <div className={styles.links}>{horizontalLinks}</div>}
            {verticalLinksInColumns && <div className={styles.columns}>{verticalLinksInColumns}</div>}
          </div>
        )}
        <div className={styles.bottom}>
          {madeInSmal && (
            <p className={styles.made}>
              <span className={styles['made-text']}>White label design system from</span>
              <SmalLogo className={styles['made-smal']} />
              <span className={styles['made-text']}>&amp;</span>
              <DnLogo className={styles['made-dn']} />
            </p>
          )}
          {socialIcons && (
            <div className={styles.social}>
              {socialIcons === true
                ? SOCIAL.map(({ name, label }) => (
                    <Button
                      key={name}
                      type="button"
                      hierarchy="Tertiary"
                      size="L"
                      icon="Only"
                      iconElement={<Icon name={name} size={24} className={styles['social-icon']} />}
                      className={styles['social-button']}
                      aria-label={label}
                    />
                  ))
                : socialIcons}
            </div>
          )}
          <div className={styles.base}>
            <Divider />
            <div className={styles['base-row']}>
              <span className={styles.marks}>
                <SmalMark className={styles['mark-smal']} />
                <DnLogo className={styles['mark-dn']} />
              </span>
              <span className={styles.note}>{note}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default NavigationFooter;
