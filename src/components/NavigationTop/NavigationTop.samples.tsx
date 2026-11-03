// Sample content for the Navigation top and side stories, taken from the Figma
// Navigation documentation. Not part of the library.
import { Avatar } from '../Avatar/Avatar';
import { Button } from '../Button/Button';
import { Tab } from '../Tab/Tab';
import { TabList } from '../TabList/TabList';
import styles from './NavigationTop.samples.module.css';
import '../../styles/tokens.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

const values = Array.from({ length: 9 }, (_, index) => `tab-${index + 1}`);

/** Figma's menu of the top bar: nine Secondary tabs of size L, the first selected. */
export function TopMenu() {
  return (
    <TabList variant="Secondary" size="L" defaultValue="tab-1" aria-label="Pages">
      {values.map((value) => (
        <Tab key={value} value={value}>
          Tab
        </Tab>
      ))}
    </TabList>
  );
}

/** Figma's menu of the side bar: nine Secondary tabs of size L with only the icon, the first selected. */
export function SideMenu() {
  return (
    <TabList variant="Secondary" size="L" orientation="Vertical" defaultValue="tab-1" aria-label="Pages">
      {values.map((value, index) => (
        <Tab key={value} value={value} icon="Only" aria-label={`Page ${index + 1}`} />
      ))}
    </TabList>
  );
}

/**
 * Figma's icons: three icon buttons that are not shown on Mobile, and the
 * Avatar. The side bar also has a button that only Mobile shows.
 */
export function SampleIcons({ mobileButton = false }: { mobileButton?: boolean }) {
  return (
    <>
      {[1, 2, 3].map((n) => (
        <Button
          key={n}
          type="button"
          hierarchy="Tertiary"
          size="L"
          icon="Only"
          className={styles['desktop-only']}
          aria-label={`Action ${n}`}
        />
      ))}
      <Avatar type="Initials">DN</Avatar>
      {mobileButton && (
        <Button
          type="button"
          hierarchy="Tertiary"
          size="L"
          icon="Only"
          className={styles['mobile-only']}
          aria-label="Mobile action"
        />
      )}
    </>
  );
}
