import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ChipGroup } from './ChipGroup';
import { Chip } from '../Chip/Chip';

const meta = {
  title: 'Impact DS/Chip group',
  component: ChipGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Chip group" component (node 9587:4156). A wrapping row of chips, 8px apart in both directions (spacing/button/2xs). The group only lays out; selection is up to the app, as the stories show.',
      },
    },
  },
} satisfies Meta<typeof ChipGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const TOPICS = ['Design', 'Engineering', 'Research', 'Marketing', 'Operations', 'Finance', 'Legal', 'Support'];

function FilterChipsDemo() {
  const [selected, setSelected] = useState<string[]>(['Design']);
  const toggle = (topic: string) =>
    setSelected((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  return (
    <div style={{ maxWidth: 420 }}>
      <ChipGroup aria-label="Topics">
        {TOPICS.map((topic) => (
          <Chip key={topic} selected={selected.includes(topic)} onClick={() => toggle(topic)}>
            {topic}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}

function RemovableChipsDemo() {
  const [items, setItems] = useState(TOPICS.slice(0, 5));
  return (
    <div style={{ maxWidth: 420 }}>
      <ChipGroup aria-label="Selected topics">
        {items.map((topic) => (
          <Chip
            key={topic}
            icon="Trailing Close"
            selected
            closeLabel={`Remove ${topic}`}
            onClose={() => setItems((prev) => prev.filter((t) => t !== topic))}
          >
            {topic}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  );
}

/** Multiple selection: chips toggle independently. */
export const FilterChips: Story = {
  render: () => <FilterChipsDemo />,
};

/** Removable chips: the close icon drops the chip from the list. */
export const RemovableChips: Story = {
  render: () => <RemovableChipsDemo />,
};

export const ExtraLarge: Story = {
  render: () => (
    <div style={{ maxWidth: 520 }}>
      <ChipGroup aria-label="Topics">
        {TOPICS.map((topic, i) => (
          <Chip key={topic} size="XL" selected={i === 1}>
            {topic}
          </Chip>
        ))}
      </ChipGroup>
    </div>
  ),
};
