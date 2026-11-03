import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Pagination } from './Pagination';

const meta = {
  title: 'Impact DS/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  argTypes: {
    page: { control: { type: 'number', min: 1, step: 1 } },
    pageCount: { control: { type: 'number', min: 1, step: 1 } },
    device: { control: 'inline-radio', options: ['Desktop', 'Mobile'] },
    info: { control: 'boolean' },
    infoText: { control: 'text' },
  },
  args: { page: 3, pageCount: 22, onPageChange: fn() },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Pagination" component set (node 9587:6127) in the SMAL Impact Design System file. Source of truth for variants: Figma. Back and Next sit around the page buttons and are built from the Button component (Tertiary, size L); the current page is a Primary button. Figma\'s variants are `Info` (a boolean) and `Device` (Desktop or Mobile). Desktop lists 10 page buttons, the dots included (9 next to the info, as Figma draws it), and always as many, so Next stays where it is while you step through the pages; Mobile lists a window of 3, and on Mobile `info` replaces the pages altogether: Back, the info and Next. The info text is yours to write ("Showing 1 – 20 of 63" on Desktop, "20 of 63" on Mobile). Back and Next are disabled at the ends. `Device` picks the layout; the spacing and text sizes still come from the tokens, so use the Breakpoint switch in the toolbar to see the Mobile values.',
      },
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Info=False, Device=Desktop. */
export const Default: Story = {};

/** Figma Info=True, Device=Desktop. */
export const WithInfo: Story = {
  name: 'With info',
  args: { info: true, infoText: 'Showing 1 – 20 of 63' },
};

/** Figma Info=False, Device=Mobile. */
export const Mobile: Story = {
  args: { device: 'Mobile' },
};

/** Figma Info=True, Device=Mobile: no page buttons; the info fills the space between Back and Next (Figma: 320 wide). */
export const MobileWithInfo: Story = {
  name: 'Mobile with info',
  args: { device: 'Mobile', info: true, infoText: '20 of 63' },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

/** The window follows the current page; Back and Next step through. */
export const Interactive: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(args.page ?? 1);
    return (
      <Pagination
        {...args}
        page={page}
        onPageChange={(next) => {
          setPage(next);
          args.onPageChange?.(next);
        }}
      />
    );
  },
};

/** Up to ten pages are all listed, with no dots. */
export const FewPages: Story = {
  name: 'Few pages',
  args: { page: 2, pageCount: 6 },
};
