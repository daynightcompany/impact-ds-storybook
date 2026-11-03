import type { HTMLAttributes, ReactNode } from 'react';
import styles from './NavigationTop.module.css';
import { ImpactLogo } from '../Logos';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface NavigationTopProps extends HTMLAttributes<HTMLElement> {
  /**
   * The logo (Figma "Impact DS logo" instance), drawn 96 wide. Defaults to the
   * Impact DS logo; pass your own, for instance wrapped in a link to the home page.
   */
  logo?: ReactNode;
  /**
   * The menu (Figma "Tab" instance): a `TabList` of Secondary tabs, size L. It
   * fills the space between the logo and the icons, and is not shown on Mobile.
   */
  menu?: ReactNode;
  /**
   * The icons at the end of the bar (Figma "Icons" slot): icon buttons, an
   * Avatar. They sit in a row with spacing/2xs between them.
   */
  icons?: ReactNode;
}

/**
 * Impact DS Navigation top — converted from the Figma "Navigation/Top"
 * component (node 9587:6543): the bar across the top of a page on the
 * background colour. The logo and the menu sit at the start (spacing/l
 * apart), the icons at the end, spacing/xl between the two groups; the bar has
 * spacing/xs above and below and spacing/m at the sides, and is as tall as its
 * tallest part (80 on Desktop with the 56 high tabs and buttons). It is a
 * `nav` landmark: give it an `aria-label`.
 *
 * Like Figma, the menu is not shown on Mobile. Which icons are shown on Mobile
 * is up to the icons you pass (Figma shows the Avatar only).
 */
export function NavigationTop({ logo = <ImpactLogo />, menu, icons, className, ...rest }: NavigationTopProps) {
  return (
    <nav className={[styles.top, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.start}>
        <div className={styles.logo}>{logo}</div>
        {menu && <div className={styles.menu}>{menu}</div>}
      </div>
      {icons && <div className={styles.icons}>{icons}</div>}
    </nav>
  );
}

export default NavigationTop;
