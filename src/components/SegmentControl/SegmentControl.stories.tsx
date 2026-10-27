import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { SegmentControl } from './SegmentControl';
import { SegmentItem } from './SegmentItem';
import { Icon } from '../Icon';

const meta = {
  title: 'Impact DS/Segment control',
  component: SegmentControl,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['M', 'L'] },
    disabled: { control: 'boolean' },
  },
  args: { onValueChange: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Segment control" component set (node 9587:3615), built on "Base/SwitchButton" 9587:3563. Source of truth for variants: Figma. M is 40px tall with 4px corners and S segments, L is 48px tall and rounded with M segments; the selected segment is a white pill. The Items slot is the children: put one `SegmentItem` per segment. It is a radio group: Tab enters it once and the arrow keys move and select. `value` / `defaultValue` match the `value` of a SegmentItem. Figma has no hover or disabled state: an unselected segment fills on hover like a Tab/Secondary, and disabled fades to 30%. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SegmentControl>;

export default meta;
type Story = StoryObj<typeof meta>;

const FourSegments = () => (
  <>
    <SegmentItem value="one">Segment</SegmentItem>
    <SegmentItem value="two">Segment</SegmentItem>
    <SegmentItem value="three">Segment</SegmentItem>
    <SegmentItem value="four">Segment</SegmentItem>
  </>
);

export const Medium: Story = {
  args: { size: 'M', defaultValue: 'one', 'aria-label': 'View' },
  render: (args) => (
    <SegmentControl {...args}>
      <SegmentItem value="one">Day</SegmentItem>
      <SegmentItem value="two">Week</SegmentItem>
      <SegmentItem value="three">Month</SegmentItem>
      <SegmentItem value="four">Year</SegmentItem>
    </SegmentControl>
  ),
};

export const Large: Story = {
  args: { size: 'L', defaultValue: 'one', 'aria-label': 'View' },
  render: Medium.render,
};

export const WithIcons: Story = {
  args: { size: 'M', defaultValue: 'light', 'aria-label': 'Theme' },
  render: (args) => (
    <SegmentControl {...args}>
      <SegmentItem value="light" aria-label="Light">
        <Icon name="sun" />
      </SegmentItem>
      <SegmentItem value="dark" aria-label="Dark">
        <Icon name="moon" />
      </SegmentItem>
    </SegmentControl>
  ),
};

export const WithDisabledSegment: Story = {
  args: { size: 'M', defaultValue: 'one', 'aria-label': 'View' },
  render: (args) => (
    <SegmentControl {...args}>
      <SegmentItem value="one">Day</SegmentItem>
      <SegmentItem value="two">Week</SegmentItem>
      <SegmentItem value="three" disabled>
        Month
      </SegmentItem>
      <SegmentItem value="four">Year</SegmentItem>
    </SegmentControl>
  ),
};

export const Disabled: Story = {
  args: { size: 'M', defaultValue: 'one', disabled: true, 'aria-label': 'View' },
  render: Medium.render,
};

function ControlledDemo() {
  const [value, setValue] = useState('week');
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <SegmentControl size="L" value={value} onValueChange={setValue} aria-label="Range">
        <SegmentItem value="day">Day</SegmentItem>
        <SegmentItem value="week">Week</SegmentItem>
        <SegmentItem value="month">Month</SegmentItem>
      </SegmentControl>
      <span style={{ fontSize: 14 }}>Selected: {value}</span>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};

export const AllVariants: Story = {
  parameters: {
    // Snapshot both breakpoint modes so a Mobile regression is caught too.
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24, justifyItems: 'start' }}>
      {(['M', 'L'] as const).map((size) => (
        <div key={size} style={{ display: 'grid', gap: 12, justifyItems: 'start' }}>
          <span style={{ fontSize: 12, color: '#888' }}>Size {size}</span>
          <SegmentControl size={size} defaultValue="one" aria-label={`Size ${size}`}>
            <FourSegments />
          </SegmentControl>
          <SegmentControl size={size} defaultValue="three" aria-label={`Size ${size}, third selected`}>
            <FourSegments />
          </SegmentControl>
          <SegmentControl size={size} defaultValue="one" disabled aria-label={`Size ${size}, disabled`}>
            <FourSegments />
          </SegmentControl>
        </div>
      ))}
    </div>
  ),
};
