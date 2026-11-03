import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button/Button';
import { SlideIndicator } from './SlideIndicator';

const meta = {
  title: 'Impact DS/Slide indicator',
  component: SlideIndicator,
  tags: ['autodocs'],
  argTypes: {
    count: { control: { type: 'number', min: 1, max: 20, step: 1 } },
    page: { control: { type: 'number', min: 1, max: 20, step: 1 } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Slide Indicator" component set (node 9587:6084) in the SMAL Impact Design System file. Source of truth for variants: Figma. The current page is a 24 x 6 bar in interactive/idle/primary, the other pages are 6px dots in border/tertiary, with 8px between them. A mark at the edge of the window shrinks to 2px while more pages lie beyond it. Figma\'s five `Page` variants (01 to 05) are the first page, the second, a middle page, the second to last and the last page of a longer list, so the stories show them on eight pages. Up to five pages are all shown; with more, a window of five follows the current page. It only shows where you are: it has no buttons. Use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof SlideIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Page=01. */
export const Default: Story = {
  args: { count: 8, page: 1 },
};

/** Figma Page=02. */
export const Second: Story = {
  args: { count: 8, page: 2 },
};

/** Figma Page=03: more pages on both sides, so both ends shrink. */
export const Middle: Story = {
  args: { count: 8, page: 4 },
};

/** Figma Page=04. */
export const SecondToLast: Story = {
  name: 'Second to last',
  args: { count: 8, page: 7 },
};

/** Figma Page=05. */
export const Last: Story = {
  args: { count: 8, page: 8 },
};

/** Up to five pages are all shown, with no shrinking. */
export const FivePages: Story = {
  name: 'Five pages',
  args: { count: 5, page: 3 },
};

/** The window follows the current page. */
export const Stepping: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(1);
    const count = args.count ?? 8;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
        <SlideIndicator {...args} count={count} page={page} />
        <div style={{ display: 'flex', gap: 16 }}>
          <Button hierarchy="Secondary" size="M" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <Button hierarchy="Secondary" size="M" disabled={page >= count} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      </div>
    );
  },
  args: { count: 8 },
};
