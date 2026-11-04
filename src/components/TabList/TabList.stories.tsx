import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabList } from './TabList';
import { Tab } from '../Tab/Tab';

const meta = {
  title: 'Impact DS/Tab list',
  component: TabList,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['Primary', 'Secondary'] },
    size: { control: 'select', options: ['M', 'L', 'XL'] },
    orientation: { control: 'select', options: ['Horizontal', 'Vertical'] },
    overflow: { control: 'inline-radio', options: ['none', 'menu'] },
    moreLabel: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Tab" component sets (node 9587:4382 for Primary tabs, 9587:4584 for Secondary tabs): a row or column of tabs, spacing/button/2xs apart. It owns the selection and the tab semantics: `value` / `defaultValue` match the `value` of a Tab, Left/Right (Up/Down when Vertical), Home and End move focus and select, and only the selected tab is in the tab order. Variant and size are set once on the list (L by default; in a Popup, a Dropdown or a Dialog a list with no size is M). In a list of Primary tabs the underline is one line that slides to the tab that is selected next (it jumps with reduced motion). With `overflow="menu"` the tabs that do not fit the width of the list (the height, when it is Vertical) are hidden behind a "…" button at its end, which opens a menu of them; the list measures the room its container gives it, so the container must not grow with the tabs.',
      },
    },
  },
} satisfies Meta<typeof TabList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'Primary', size: 'L', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: (args) => (
    <TabList {...args}>
      <Tab value="overview">Overview</Tab>
      <Tab value="details">Details</Tab>
      <Tab value="activity">Activity</Tab>
      <Tab value="settings">Settings</Tab>
    </TabList>
  ),
};

export const Secondary: Story = {
  args: { variant: 'Secondary', size: 'L', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

/** Size M is not in Figma yet: it is built like the Button M and the Chip M, 40 high. */
export const Medium: Story = {
  args: { variant: 'Primary', size: 'M', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

export const MediumSecondary: Story = {
  name: 'Medium secondary',
  args: { variant: 'Secondary', size: 'M', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

export const ExtraLarge: Story = {
  args: { variant: 'Primary', size: 'XL', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

export const Vertical: Story = {
  args: { variant: 'Primary', size: 'XL', orientation: 'Vertical', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

export const VerticalSecondary: Story = {
  args: { variant: 'Secondary', size: 'XL', orientation: 'Vertical', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: Primary.render,
};

export const WithIcons: Story = {
  args: { variant: 'Primary', size: 'L', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: (args) => (
    <TabList {...args}>
      <Tab value="overview" icon="Leading">Overview</Tab>
      <Tab value="details" icon="Trailing">Details</Tab>
      <Tab value="settings" icon="Only" aria-label="Settings" />
    </TabList>
  ),
};

export const WithDisabledTab: Story = {
  args: { variant: 'Secondary', size: 'L', orientation: 'Horizontal', defaultValue: 'overview', 'aria-label': 'Sections' },
  render: (args) => (
    <TabList {...args}>
      <Tab value="overview">Overview</Tab>
      <Tab value="details" disabled>Details</Tab>
      <Tab value="activity">Activity</Tab>
    </TabList>
  ),
};

const PANELS: Record<string, string> = {
  overview: 'A summary of the project: goals, owners and the current status.',
  details: 'The full specification, with every open question listed.',
  activity: 'Everything that changed this week, newest first.',
};

function TabsWithPanelsDemo() {
  const [value, setValue] = useState('overview');
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      <TabList variant="Primary" size="XL" value={value} onValueChange={setValue} aria-label="Sections">
        {Object.keys(PANELS).map((id) => (
          <Tab key={id} value={id} id={`tab-${id}`} aria-controls={`panel-${id}`}>
            {id[0].toUpperCase() + id.slice(1)}
          </Tab>
        ))}
      </TabList>
      <div role="tabpanel" id={`panel-${value}`} aria-labelledby={`tab-${value}`} style={{ color: 'var(--theme-color-font-paragraph-primary)' }}>
        {PANELS[value]}
      </div>
    </div>
  );
}

/** Controlled list with a panel: the app owns `value` and the panels. */
export const WithPanels: Story = {
  render: () => <TabsWithPanelsDemo />,
};

const PAGES = Array.from({ length: 9 }, (_, index) => `page-${index + 1}`);

const pageTabs = (orientation: 'Horizontal' | 'Vertical') =>
  PAGES.map((id, index) => (
    <Tab key={id} value={id} icon={orientation === 'Vertical' ? 'Only' : 'False'} aria-label={`Page ${index + 1}`}>
      {`Page ${index + 1}`}
    </Tab>
  ));

/** `overflow="menu"` in a row of its own width (drag the corner of the frame to change it): the tabs that fit are shown, the rest are behind the "…" button. */
export const OverflowMenu: Story = {
  name: 'Overflow menu',
  args: {
    variant: 'Secondary',
    size: 'L',
    orientation: 'Horizontal',
    defaultValue: 'page-1',
    'aria-label': 'Pages',
    overflow: 'menu',
    moreLabel: 'More pages',
  },
  decorators: [
    (Story) => (
      <div style={{ boxSizing: 'border-box', width: 560, maxWidth: '100%', padding: 8, overflow: 'hidden', resize: 'horizontal', border: '1px dashed #888' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <TabList {...args}>{pageTabs('Horizontal')}</TabList>,
};

/** The selected tab is one of the hidden ones: the "…" button has the selected look, and the menu marks the tab. */
export const SelectedTabHidden: Story = {
  name: 'Selected tab hidden',
  args: { ...OverflowMenu.args, 'aria-label': 'Pages, last selected', defaultValue: 'page-9' },
  decorators: OverflowMenu.decorators,
  render: OverflowMenu.render,
};

/** The same with Primary tabs: the stroke is along the bottom of the "…" button while the selected tab is hidden. */
export const OverflowMenuPrimary: Story = {
  name: 'Overflow menu, Primary',
  args: { ...OverflowMenu.args, variant: 'Primary', 'aria-label': 'Pages, Primary', defaultValue: 'page-9' },
  decorators: OverflowMenu.decorators,
  render: OverflowMenu.render,
};

/** Vertical: the tabs that do not fit the height are hidden, and the menu opens beside the list. */
export const OverflowMenuVertical: Story = {
  name: 'Overflow menu, Vertical',
  args: { ...OverflowMenu.args, orientation: 'Vertical', 'aria-label': 'Pages, vertical' },
  decorators: [
    (Story) => (
      <div style={{ boxSizing: 'border-box', display: 'flex', flexDirection: 'column', height: 360, padding: 8, overflow: 'hidden', resize: 'vertical', border: '1px dashed #888' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <TabList {...args}>{pageTabs('Vertical')}</TabList>,
};
