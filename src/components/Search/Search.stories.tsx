import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Search, type SearchProps, type SearchTag } from './Search';

const TAGS: SearchTag[] = [
  { label: 'Amet', tone: 'purple' },
  { label: 'Lorem', tone: 'orange' },
];

const meta = {
  title: 'Impact DS/Search',
  component: Search,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    icon: { control: 'boolean' },
    clear: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { onClear: fn(), onTagRemove: fn() },
  decorators: [
    (Story) => (
      <div style={{ width: 327 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Search" component set (node 9587:5505): the Base/Input Field box with a search icon, the text and a clear button. Booleans: Icon and Chevron (the clear icon in Figma) are the props `icon` and `clear`. Idle, Hover, Focused and Disabled are the browser\'s own states; Empty and Populated follow the text. "Populated multi" is `tags`: pills (the Label component, Size S, no gap between them) in front of the text, each with a remove button; Backspace in an empty field removes the last one. In Figma the Search focus stroke is interactive/idle/stroke and a hovered empty field is not dimmed, unlike the Input field. The AllVariants story shows Hover and Focused with `data-state`. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Search" / Idle / Empty. */
export const Default: Story = {};

export const Populated: Story = {
  args: { defaultValue: 'Input' },
};

export const WithoutIcon: Story = {
  args: { icon: false },
};

export const WithoutClear: Story = {
  args: { clear: false, defaultValue: 'Input' },
};

/** Figma "Populated multi". */
export const WithTags: Story = {
  args: { tags: TAGS },
};

export const ManyTags: Story = {
  args: {
    tags: [
      { label: 'Amet', tone: 'purple' },
      { label: 'Lorem', tone: 'orange' },
      { label: 'Ipsum', tone: 'salad' },
      { label: 'Dolor', tone: 'azure' },
      { label: 'Consectetur', tone: 'pink' },
    ],
  },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'Input' },
};

export const DisabledWithTags: Story = {
  args: { disabled: true, tags: TAGS },
};

/** Type and press Enter to add a tag; Backspace in the empty field or the pills' buttons remove one. */
export const Interactive: Story = {
  render: function Render(args) {
    const [tags, setTags] = useState<SearchTag[]>(TAGS);
    const [text, setText] = useState('');
    return (
      <Search
        {...args}
        tags={tags}
        value={text}
        placeholder="Add a tag"
        onChange={(event) => setText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && text.trim()) {
            event.preventDefault();
            setTags((current) => [...current, { label: text.trim(), tone: 'purple' }]);
            setText('');
          }
        }}
        onTagRemove={(_tag, index) => setTags((current) => current.filter((_, i) => i !== index))}
        onClear={() => setTags([])}
      />
    );
  },
};

type Case = { name: string; state?: 'hover' | 'focus'; props: Partial<SearchProps> };

const CASES: Case[] = [
  { name: 'Idle', props: {} },
  { name: 'Hover', state: 'hover', props: {} },
  { name: 'Focused', state: 'focus', props: {} },
  { name: 'Disabled', props: { disabled: true } },
];

/** The Figma variant set: State (Idle, Hover, Focused, Disabled) x Condition (Empty, Populated, Populated multi). */
export const AllVariants: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      {CASES.map(({ name, state, props }) => (
        <div key={name} style={{ display: 'grid', gap: 4 }}>
          <span style={{ fontSize: 11, color: '#888' }}>{name}</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 327px)', gap: 24, alignItems: 'start' }}>
            <Search placeholder="Label" data-state={state} {...props} />
            <Search placeholder="Label" defaultValue="Input" data-state={state} {...props} />
            <Search tags={TAGS} data-state={state} {...props} />
          </div>
        </div>
      ))}
    </div>
  ),
};
