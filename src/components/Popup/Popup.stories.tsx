import { useId, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Popup } from './Popup';
import { Button } from '../Button/Button';
import { CellGroup } from '../CellGroup/CellGroup';
import { CellSelector } from '../CellSelector/CellSelector';
import { DialogFooter } from '../DialogFooter/DialogFooter';
import { Dropdown } from '../Dropdown/Dropdown';
import { Search } from '../Search/Search';
import { Tab } from '../Tab/Tab';
import { TabList } from '../TabList/TabList';

const COUNTRIES = [
  'Estonia',
  'Finland',
  'Latvia',
  'Lithuania',
  'Sweden',
  'Norway',
  'Denmark',
  'Poland',
  'Germany',
  'Netherlands',
];

/** The Figma list: a Cell group of checkbox cells, the first one checked. */
function Countries({ count = COUNTRIES.length }: { count?: number }) {
  return (
    <CellGroup type="Checkbox" aria-label="Countries">
      {COUNTRIES.slice(0, count).map((country, index) => (
        <CellSelector key={country} defaultChecked={index === 0}>
          {country}
        </CellSelector>
      ))}
    </CellGroup>
  );
}

const meta = {
  title: 'Impact DS/Popup',
  component: Popup,
  tags: ['autodocs'],
  argTypes: {
    search: { control: 'boolean' },
    tabs: { control: 'boolean' },
    footer: { control: 'boolean' },
    width: { control: 'number' },
    children: { control: false },
    anchorRef: { table: { disable: true } },
    open: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    placement: { table: { disable: true } },
    offset: { table: { disable: true } },
    matchAnchorWidth: { table: { disable: true } },
    autoFocus: { table: { disable: true } },
  },
  args: { search: true, tabs: true, footer: true },
  parameters: {
    docs: {
      description: {
        component:
          'Converted from the Figma "Popup/Dropdown" (node 9723:19631): a 688px panel with a Search, a row of Tabs, a list and a Footer. The Figma booleans Search, Tabs and Footer are props (all on in Figma); turn them off for a simple dropdown popover that is only a list. The list is the part that scrolls when the panel has a height limit. Give it an `anchorRef` and it opens from that element as a popover (see the "Dropdown with a popup" and "Simple dropdown" stories); the Breakpoint switch in the toolbar shows the Mobile values (on Mobile Figma uses the Dialog\'s Select form instead).',
      },
    },
  },
} satisfies Meta<typeof Popup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma "Popup/Dropdown" as drawn: every boolean on, ten checkbox cells. */
export const Default: Story = {
  render: (args) => (
    <Popup {...args}>
      <Countries />
    </Popup>
  ),
};

/** A simple dropdown popover: only the list. */
export const ListOnly: Story = {
  args: { search: false, tabs: false, footer: false },
  render: (args) => (
    <Popup {...args} width={327}>
      <Countries count={5} />
    </Popup>
  ),
};

export const WithSearch: Story = {
  args: { search: true, tabs: false, footer: false },
  render: (args) => (
    <Popup {...args} width={327}>
      <Countries count={5} />
    </Popup>
  ),
};

export const WithTabs: Story = {
  args: { search: false, tabs: true, footer: false },
  render: (args) => (
    <Popup {...args} width={327}>
      <Countries count={5} />
    </Popup>
  ),
};

export const WithFooter: Story = {
  args: { search: false, tabs: false, footer: true },
  render: (args) => (
    <Popup {...args}>
      <Countries count={5} />
    </Popup>
  ),
};

/** With a height limit the Search, Tabs and Footer stay and the list scrolls. */
export const LimitedHeight: Story = {
  render: (args) => (
    <Popup {...args} style={{ maxHeight: 480 }}>
      <Countries />
    </Popup>
  ),
};

/** Your own parts instead of the placeholders: a Search, Tabs and a Footer with named buttons. */
export const CustomParts: Story = {
  render: (args) => (
    <Popup
      {...args}
      width={480}
      search={<Search label="Search countries" placeholder="Search countries" />}
      tabs={
        <TabList defaultValue="all" aria-label="Show">
          <Tab value="all">All</Tab>
          <Tab value="selected">Selected</Tab>
        </TabList>
      }
      footer={<DialogFooter buttonWidth="2 CTA" secondaryButton="Cancel" primaryButton="Apply" />}
    >
      <Countries count={6} />
    </Popup>
  ),
};

/** What the Figma Popup does with each combination of its three booleans. */
export const AllVariants: Story = {
  parameters: {
    chromatic: {
      modes: {
        desktop: { breakpoint: 'desktop' },
        mobile: { breakpoint: 'mobile' },
      },
    },
  },
  render: () => {
    const combos: Array<[boolean, boolean, boolean]> = [
      [true, true, true],
      [true, true, false],
      [true, false, true],
      [false, true, true],
      [true, false, false],
      [false, true, false],
      [false, false, true],
      [false, false, false],
    ];
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(480px, 100%), 1fr))',
          gap: 24,
          alignItems: 'start',
        }}
      >
        {combos.map(([search, tabs, footer]) => (
          <div
            key={`${search}${tabs}${footer}`}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 4, minWidth: 0 }}
          >
            <span style={{ fontSize: 11, color: '#888' }}>
              Search {search ? 'on' : 'off'} · Tabs {tabs ? 'on' : 'off'} · Footer {footer ? 'on' : 'off'}
            </span>
            <Popup search={search} tabs={tabs} footer={footer} width={480}>
              <Countries count={3} />
            </Popup>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * The Dropdown input and the Popup as a popover: the Search filters the list,
 * the Tabs switch between all countries and the ones picked, the footer clears,
 * cancels or applies. Escape, a press outside and the focus leaving close it.
 */
export const DropdownWithAPopup: Story = {
  name: 'Dropdown with a popup',
  // The snapshot waits for the popup to finish fading in.
  parameters: { layout: 'padded', chromatic: { delay: 700 } },
  render: function Render() {
    const anchor = useRef<HTMLButtonElement>(null);
    const popupId = useId();
    const [open, setOpen] = useState(false);
    const [applied, setApplied] = useState(['Estonia', 'Finland']);
    const [draft, setDraft] = useState(applied);
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('all');

    const toggle = () => {
      if (!open) {
        // Every opening starts from what was applied.
        setDraft(applied);
        setQuery('');
        setTab('all');
      }
      setOpen(!open);
    };
    const needle = query.trim().toLowerCase();
    const visible = COUNTRIES.filter(
      (country) => country.toLowerCase().includes(needle) && (tab === 'all' || draft.includes(country)),
    );

    return (
      <div style={{ width: 'min(688px, 100%)', minHeight: 560 }}>
        <Dropdown
          ref={anchor}
          label="Countries"
          value={applied.join(', ')}
          open={open}
          onClick={toggle}
          aria-controls={popupId}
        />
        <Popup
          id={popupId}
          aria-label="Choose countries"
          anchorRef={anchor}
          open={open}
          onOpenChange={setOpen}
          matchAnchorWidth
          search={
            <Search
              label="Search countries"
              placeholder="Search countries"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery('')}
            />
          }
          tabs={
            <TabList value={tab} onValueChange={setTab} aria-label="Show">
              <Tab value="all">All</Tab>
              <Tab value="selected">Selected ({draft.length})</Tab>
            </TabList>
          }
          footer={
            <DialogFooter
              tertiaryButton={
                <Button hierarchy="Tertiary" size="L" onClick={() => setDraft([])}>
                  Clear all
                </Button>
              }
              secondaryButton={
                <Button hierarchy="Secondary" size="L" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
              }
              primaryButton={
                <Button
                  hierarchy="Primary"
                  size="L"
                  onClick={() => {
                    setApplied(draft);
                    setOpen(false);
                  }}
                >
                  Apply
                </Button>
              }
            />
          }
        >
          {visible.length > 0 ? (
            <CellGroup type="Checkbox" aria-label="Countries">
              {visible.map((country) => (
                <CellSelector
                  key={country}
                  checked={draft.includes(country)}
                  onChange={(event) =>
                    setDraft((current) =>
                      event.target.checked ? [...current, country] : current.filter((item) => item !== country),
                    )
                  }
                >
                  {country}
                </CellSelector>
              ))}
            </CellGroup>
          ) : (
            <p style={{ margin: 0, padding: '12px 0' }}>No countries found</p>
          )}
        </Popup>
      </div>
    );
  },
  // Open it, so the canvas and the visual tests show the popup.
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /countries/i }));
  },
};

/** A simple dropdown popover: no Search, Tabs or Footer, as wide as the dropdown; picking an option closes it. */
export const SimpleDropdown: Story = {
  name: 'Simple dropdown',
  parameters: { layout: 'padded', chromatic: { delay: 700 } },
  render: function Render() {
    const anchor = useRef<HTMLButtonElement>(null);
    const popupId = useId();
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState<string>();
    // The arrow keys move the selection through the radios; only a click or Enter picks and closes.
    const byPointer = useRef(false);

    return (
      <div style={{ width: 327, minHeight: 460 }}>
        <Dropdown
          ref={anchor}
          label="Country"
          value={country}
          open={open}
          onClick={() => setOpen(!open)}
          aria-controls={popupId}
        />
        <Popup
          id={popupId}
          aria-label="Country"
          anchorRef={anchor}
          open={open}
          onOpenChange={setOpen}
          matchAnchorWidth
          search={false}
          tabs={false}
          footer={false}
        >
          <CellGroup
            type="Radio"
            aria-label="Country"
            value={country}
            onPointerDown={() => {
              byPointer.current = true;
            }}
            onKeyDown={(event) => {
              byPointer.current = false;
              if (event.key === 'Enter') setOpen(false);
            }}
            onValueChange={(next) => {
              setCountry(next);
              if (byPointer.current) setOpen(false);
            }}
          >
            {COUNTRIES.slice(0, 6).map((name) => (
              <CellSelector key={name} value={name} showIcon={false}>
                {name}
              </CellSelector>
            ))}
          </CellGroup>
        </Popup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    await userEvent.click(within(canvasElement).getByRole('button', { name: /country/i }));
  },
};
