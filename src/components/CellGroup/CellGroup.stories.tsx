import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { CellGroup } from './CellGroup';
import { CellList } from '../CellList/CellList';
import { CellSelector } from '../CellSelector/CellSelector';
import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Cell group',
  component: CellGroup,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['Link', 'Radio', 'Switch', 'Checkbox'] },
  },
  args: { onValueChange: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 420 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Cell group" component set (node 9587:5878) in the SMAL Impact Design System file. Type is Link (cell list rows), Radio, Switch or Checkbox (cell selector rows); the Items slot is the children. A Divider is added between the rows for you, with 8px above and below it. A Link group is a list. A Radio group is a radio group: give each `CellSelector` a `value` and the group a `value` / `defaultValue` and `onValueChange`; Tab enters it once and the arrow keys move and select. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof CellGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Link: Story = {
  args: { type: 'Link', 'aria-label': 'Settings' },
  render: (args) => (
    <CellGroup {...args}>
      <CellList icon={<Icon name="account" />}>Account</CellList>
      <CellList icon={<Icon name="alert" />} subtitle="Choose what we email you">
        Notifications
      </CellList>
      <CellList icon={<Icon name="files" />} label="2.4 GB">
        Storage
      </CellList>
      <CellList avatar={<Avatar type="Initials">DN</Avatar>} subtitle="Design Systems Lead">
        Profile
      </CellList>
    </CellGroup>
  ),
};

export const Radio: Story = {
  args: { type: 'Radio', defaultValue: 'weekly', 'aria-label': 'Digest frequency' },
  render: (args) => (
    <CellGroup {...args}>
      <CellSelector value="daily">Daily</CellSelector>
      <CellSelector value="weekly" subtitle="Every Monday">
        Weekly
      </CellSelector>
      <CellSelector value="never">Never</CellSelector>
    </CellGroup>
  ),
};

export const Switch: Story = {
  args: { type: 'Switch', 'aria-label': 'Notification channels' },
  render: (args) => (
    <CellGroup {...args}>
      <CellSelector defaultChecked>Email</CellSelector>
      <CellSelector subtitle="Only for important updates">Push</CellSelector>
      <CellSelector>SMS</CellSelector>
    </CellGroup>
  ),
};

export const Checkbox: Story = {
  args: { type: 'Checkbox', 'aria-label': 'Topics' },
  render: (args) => (
    <CellGroup {...args}>
      <CellSelector defaultChecked>Design</CellSelector>
      <CellSelector>Engineering</CellSelector>
      <CellSelector defaultChecked subtitle="Roadmap and releases">
        Product
      </CellSelector>
    </CellGroup>
  ),
};

function ControlledRadioDemo() {
  const [value, setValue] = useState('b');
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <CellGroup type="Radio" value={value} onValueChange={setValue} aria-label="Plan">
        <CellSelector value="a">Starter</CellSelector>
        <CellSelector value="b">Team</CellSelector>
        <CellSelector value="c">Enterprise</CellSelector>
      </CellGroup>
      <span style={{ fontSize: 14 }}>Selected: {value}</span>
    </div>
  );
}

export const ControlledRadio: Story = {
  render: () => <ControlledRadioDemo />,
};

export const AllTypes: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 32, width: 420 }}>
      <CellGroup type="Link" aria-label="Link group">
        <CellList>Title</CellList>
        <CellList>Title</CellList>
        <CellList>Title</CellList>
      </CellGroup>
      <CellGroup type="Radio" defaultValue="a" aria-label="Radio group">
        <CellSelector value="a">Title</CellSelector>
        <CellSelector value="b">Title</CellSelector>
        <CellSelector value="c">Title</CellSelector>
      </CellGroup>
      <CellGroup type="Switch" aria-label="Switch group">
        <CellSelector>Title</CellSelector>
        <CellSelector defaultChecked>Title</CellSelector>
        <CellSelector>Title</CellSelector>
      </CellGroup>
      <CellGroup type="Checkbox" aria-label="Checkbox group">
        <CellSelector defaultChecked>Title</CellSelector>
        <CellSelector>Title</CellSelector>
        <CellSelector>Title</CellSelector>
      </CellGroup>
    </div>
  ),
};
