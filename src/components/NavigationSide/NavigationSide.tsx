import type { HTMLAttributes, ReactNode } from 'react';
import styles from './NavigationSide.module.css';
import { ImpactLogo } from '../Logos';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

export interface NavigationSideProps extends HTMLAttributes<HTMLElement> {
  /**
   * The logo (Figma "Impact DS logo" instance), drawn 56 wide. Defaults to the
   * Impact DS logo; pass your own, for instance wrapped in a link to the home page.
   */
  logo?: ReactNode;
  /**
   * The menu (Figma "Tab" instance, Position=Vertical): a vertical `TabList` of
   * Secondary tabs, size L, with the icon only. It is not shown on Mobile.
   */
  menu?: ReactNode;
  /**
   * The icons at the foot of the bar (Figma "Icons" slot): icon buttons, an
   * Avatar. They sit in a column, centred, with spacing/2xs between them.
   */
  icons?: ReactNode;
}

/**
 * Impact DS Navigation side — converted from the Figma "Navigation/Side"
 * component (node 9587:6569): a column on the surface colour, as wide as its
 * content (88: the 56 wide logo and tabs with spacing/s on both sides, and at
 * least 72) and as tall as the container it is in. The logo and the menu are
 * at the top (spacing/l apart), the icons at the foot, and the bar has
 * spacing/m above and below, so the two groups drift apart as it grows. It is
 * a `nav` landmark: give it an `aria-label`.
 *
 * Like Figma, the menu is not shown on Mobile. Which icons are shown on Mobile
 * is up to the icons you pass.
 */
export function NavigationSide({ logo = <ImpactLogo />, menu, icons, className, ...rest }: NavigationSideProps) {
  return (
    <nav className={[styles.side, className].filter(Boolean).join(' ')} {...rest}>
      <div className={styles.start}>
        <div className={styles.logo}>{logo}</div>
        {menu && <div className={styles.menu}>{menu}</div>}
      </div>
      {icons && <div className={styles.icons}>{icons}</div>}
    </nav>
  );
}

export default NavigationSide;
