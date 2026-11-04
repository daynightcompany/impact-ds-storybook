import type { Meta, StoryObj } from '@storybook/react-vite';
import { Table } from '../Table/Table';
import { TableCell, TableRow } from './TableRow';
import { DataCells, HeaderCells, sampleColumns } from './TableRow.samples';

const meta = {
  title: 'Impact DS/Table row',
  component: TableRow,
  // The cells get their own tab in the props table (`span`).
  subcomponents: { TableCell },
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'inline-radio', options: ['Default', 'Hover', 'Header'] },
    children: { control: false },
  },
  args: {
    type: 'Default',
    children: <DataCells />,
  },
  // A row takes its column widths from the Table around it.
  decorators: [
    (Story) => (
      <Table columns={sampleColumns} aria-label="Example table">
        <Story />
      </Table>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Table row" component set (node 9587:6410) in the SMAL Impact Design System file. Source of truth for variants: Figma. One row of a table. Figma\'s `Type` is `Default` (a card on the surface fill), `Hover` (the tint under the pointer: a Default row shows it by itself when hovered, `type="Hover"` shows it without the pointer) and `Header` (no fill beyond the page colour, for the column headings). The cells (Figma\'s `Cells` slot) are the `children`: a `TableCell` for each column, holding an Avatar, a text block, a Label, a Checkbox or whatever the column needs (the samples here are Figma\'s). In a `Table` the cells follow its `columns`; on its own a row gives every cell an equal column. The cells sit as one band in the middle of the row, and each one is centred on the same horizontal line (Figma has them at the top of the band; centred on request), so a one-line cell, a two-line text block, a Label and a Checkbox line up; a Default row is at least 72 high and grows with its content, a Header row is 72 high. A row is never narrower than the minimum widths of its columns, so the Table scrolls sideways on a narrow screen. Figma spreads the header chips evenly across the row, so they miss the columns below; here a header cell sits on its column (the first covers the avatar column and the first text column, `span={2}`), so it lines up with the cells beneath it. The samples also copy two sizes from Figma with local styles: the header chips are a Chip M with larger padding and the XL text (56 high), and the Checkbox is drawn at 75% (18 x 18). The sizes of the row are the same on Mobile.',
      },
    },
  },
} satisfies Meta<typeof TableRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma Type=Default: a row of data. Hover it to see the Hover look. */
export const Default: Story = {};

/** Figma Type=Hover. */
export const Hover: Story = {
  args: { type: 'Hover' },
};

/** Figma Type=Header: four headings and a select-all checkbox. */
export const Header: Story = {
  args: { type: 'Header', children: <HeaderCells /> },
};
