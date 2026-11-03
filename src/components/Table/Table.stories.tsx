import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LabelTone } from '../Label/Label';
import { TableCell, TableRow } from '../TableRow/TableRow';
import { DataCells, HeaderChip, HeaderCells, TextBlock, sampleColumns } from '../TableRow/TableRow.samples';
import { Table } from './Table';

/** Figma's nine rows: the first Label is dark, the others each take a colour. */
const tones: LabelTone[] = ['dark', 'orange', 'salad', 'ochre', 'azure', 'pink', 'wine', 'warning', 'error'];

const rows = (
  <>
    <TableRow type="Header">
      <HeaderCells />
    </TableRow>
    {tones.map((tone) => (
      <TableRow key={tone}>
        <DataCells tone={tone} />
      </TableRow>
    ))}
  </>
);

const meta = {
  title: 'Impact DS/Table',
  component: Table,
  tags: ['autodocs'],
  argTypes: {
    columns: { control: 'text' },
    children: { control: false },
  },
  args: {
    columns: sampleColumns,
    'aria-label': 'Example table',
    children: rows,
  },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Table" component (node 9587:6441) in the SMAL Impact Design System file. Source of truth for variants: Figma. A stack of rows 4 apart: a header row and the data rows (Figma\'s `Rows` slot is the `children`, `TableRow` elements). `columns` sets the width of each column for all rows at once, so the header cells line up with the cells below them: a CSS `grid-template-columns` value (Figma\'s table is `40px repeat(4, minmax(0, 1fr)) 18px`: an avatar, four equal columns and a checkbox) or a number for that many equal columns. Without it, every cell of a row is an equal column. The table fills the width of its container (Figma: 1872) and has no Mobile layout of its own: put it in a container that scrolls sideways on a narrow screen. It is made of divs with the table, row, columnheader and cell roles; give it an `aria-label`. The samples copy two sizes from Figma with local styles: the header chips are a Chip M with larger padding and the XL text (56 high), and the Checkbox is drawn at 75% (18 x 18).',
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma's table: a header row and nine rows. */
export const Default: Story = {};

/** Not drawn in Figma: `columns` as a number, four equal columns and plain text. */
export const EqualColumns: Story = {
  name: 'Equal columns',
  args: {
    columns: 4,
    children: (
      <>
        <TableRow type="Header">
          {[0, 1, 2, 3].map((i) => (
            <TableCell key={i}>
              <HeaderChip />
            </TableCell>
          ))}
        </TableRow>
        {[0, 1, 2].map((row) => (
          <TableRow key={row}>
            {[0, 1, 2, 3].map((i) => (
              <TableCell key={i}>
                <TextBlock />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    ),
  },
};
