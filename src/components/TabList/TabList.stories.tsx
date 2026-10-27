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
    size: { control: 'select', options: ['L', 'XL'] },
    orientation: { control: 'select', options: ['Horizontal', 'Vertical'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Tab" component sets (node 9587:4382 for Primary tabs, 9587:4584 for Secondary tabs): a row or column of tabs, 8px apart. It owns the selection and the tab semantics: `value` / `defaultValue` match the `value` of a Tab, Left/Right (Up/Down when Vertical), Home and End move focus and select, and only the selected tab is in the tab order. Variant and size are set once on the list.',
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
