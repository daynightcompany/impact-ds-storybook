import { useId, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import styles from './Dialog.module.css';
import { CellSelector } from '../CellSelector/CellSelector';
import { DialogHeader } from '../DialogHeader/DialogHeader';
import { Dropdown } from '../Dropdown/Dropdown';
import { InputField } from '../InputField/InputField';
import { TextInputGroup } from '../TextInputGroup/TextInputGroup';
import { footerSlot, isShown, searchSlot, tabsSlot, type Slot } from '../Popup/PopupParts';
import '../../styles/tokens.css';
import '../../styles/tokens.text-modes.css';
// Hand-maintained companion to tokens.css: font import + alpha-color stopgap.
import '../../styles/tokens.extras.css';

/** Figma "Form": a form with fields and selectors, or a list to choose from. */
export type DialogForm = 'Default' | 'Select';

export interface DialogSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** The title of the section (Figma "Text/Card text block", Size M). */
  title?: ReactNode;
  /** `radiogroup` for a set of radio cells, `group` for checkboxes and switches. */
  role?: 'group' | 'radiogroup';
}

/**
 * A titled set of cells in a Dialog: the title (MD regular) and the cells under
 * it, 8px (spacing/xs) apart. The Figma Selectors, Checkbox content and Switch
 * content slots are made of these.
 */
export function DialogSection({ title = 'Title', role = 'group', className, children, ...rest }: DialogSectionProps) {
  const titleId = useId();
  return (
    <div
      role={role}
      aria-labelledby={title != null ? titleId : undefined}
      {...rest}
      className={[styles.section, className].filter(Boolean).join(' ')}
    >
      {title != null && (
        <div id={titleId} className={styles.sectionTitle}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

/** What Figma has in the slots, as placeholders: replace them with your own. */
function DefaultFormFields() {
  return (
    <>
      <TextInputGroup aria-label="Name">
        <InputField label="Label" defaultValue="Input" />
        <InputField label="Label" />
      </TextInputGroup>
      <Dropdown label="Label" value="Input" />
      <Dropdown label="Label" value="Input" />
    </>
  );
}

function DefaultRadio() {
  const name = useId();
  return (
    <DialogSection role="radiogroup">
      <CellSelector selector="radio" name={name} value="first" defaultChecked>
        Title
      </CellSelector>
      <CellSelector selector="radio" name={name} value="second">
        Title
      </CellSelector>
    </DialogSection>
  );
}

function DefaultCheckboxes() {
  return (
    <DialogSection>
      <CellSelector selector="check" defaultChecked>
        Title
      </CellSelector>
      <CellSelector selector="check">Title</CellSelector>
    </DialogSection>
  );
}

function DefaultSwitches() {
  return (
    <DialogSection>
      <CellSelector selector="switch">Title</CellSelector>
      <CellSelector selector="switch">Title</CellSelector>
    </DialogSection>
  );
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLElement>, 'title' | 'children'> {
  /** Figma "Form". `Default` is a form: fields, radios, checkboxes, switches. `Select` is a list to choose from, with search and tabs. */
  form?: DialogForm;
  /**
   * Figma boolean "Header". `true` shows the header with the `title` and a
   * close button (`onClose`); pass your own <DialogHeader> to change it.
   */
  header?: Slot;
  /** The title in the header (Figma "Title"). */
  title?: ReactNode;
  /**
   * Figma boolean "Footer". `true` shows the 2 CTA footer (the buttons stack
   * when the dialog is narrow); pass your own <DialogFooter> to name the buttons.
   */
  footer?: Slot;
  /** `Default` form. The Figma slot "Form fields": the text inputs and dropdowns. `true` shows placeholders. */
  formFields?: Slot;
  /** `Default` form. Figma boolean "Radio" and its slot "Selectors": a <DialogSection> of radio cells. */
  radio?: Slot;
  /** `Default` form. Figma boolean "Checkboxes" and its slot "Checkbox content". */
  checkboxes?: Slot;
  /** `Default` form. Figma boolean "Switches" and its slot "Switch content". */
  switches?: Slot;
  /** `Select` form. Figma boolean "Search": `true` shows an empty search field, a node replaces it. */
  search?: Slot;
  /** `Select` form. Figma boolean "Tabs": `true` shows placeholder tabs, a node (a <TabList>) replaces them. */
  tabs?: Slot;
  /** `Select` form: the list to choose from (a <CellGroup>). */
  children?: ReactNode;
  /** Called by the close button, and, in a `modal` dialog, by Escape and a press on the backdrop. */
  onClose?: () => void;
  /**
   * Shows the dialog as a modal: it opens in the top layer over a backdrop,
   * centred (a bottom sheet on Mobile), with the focus kept inside, and closes
   * on Escape. Control it with `open` and `onClose`. Without it the dialog is
   * just the panel, in the flow.
   */
  modal?: boolean;
  /** A `modal` dialog is open. */
  open?: boolean;
  /** Width of the panel. Figma has 375px; it never exceeds the space it is in. */
  width?: number | string;
  ref?: Ref<HTMLElement>;
}

/**
 * Impact DS Dialog — converted from the Figma "Dialog" component set (node
 * 9587:6878): a 375px panel with the M corner radius and Shadow M, on the
 * primary background, with a 32px (spacing/l, 24px on Mobile) padding and gap.
 * Form Default or Select; the booleans Header, Footer, Radio, Checkboxes,
 * Switches, Tabs and Search and the slots Form fields, Selectors, Checkbox
 * content and Switch content are props. The slots take any node; `true` shows
 * the placeholders Figma has there.
 *
 * Default: the header, the fields, the radios, the checkboxes and the switches,
 * then the footer. Select: the header, a Search, Tabs, the list (`children`)
 * and the footer, like the Popup does on Desktop.
 *
 * Figma draws the Dialog in the Mobile mode: a drag handle sits above the sheet
 * on Mobile only (it is decorative here), and every size follows the Breakpoint
 * switch. Figma has no padding under the last part, as the footer brings its
 * own; without a footer the panel gets the same padding.
 */
export function Dialog({
  form = 'Default',
  header = true,
  title = 'Title',
  footer = true,
  formFields = true,
  radio = true,
  checkboxes = true,
  switches = true,
  search = true,
  tabs = true,
  children,
  onClose,
  modal = false,
  open = false,
  width,
  className,
  style,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  onClick,
  ...rest
}: DialogProps) {
  const titleId = useId();
  const root = useRef<HTMLElement | null>(null);
  const content = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => root.current as HTMLElement);

  // A modal dialog follows `open` through the native <dialog>.
  useLayoutEffect(() => {
    const dialog = root.current as HTMLDialogElement | null;
    if (!modal || !dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [modal, open]);

  const headerNode =
    header === true ? (
      <DialogHeader title={title} leftIcons={false} additionalIcons={false} onClose={onClose} titleId={titleId} />
    ) : isShown(header) ? (
      header
    ) : null;
  const footerNode = footerSlot(footer, { buttonWidth: '2 CTA' });
  const hasFooter = isShown(footerNode);

  const slot = (value: Slot, placeholder: ReactNode) => (value === true ? placeholder : isShown(value) ? value : null);

  const body =
    form === 'Select' ? (
      <>
        {isShown(search) && <div className={styles.fixed}>{searchSlot(search)}</div>}
        {isShown(tabs) && <div className={`${styles.fixed} ${styles.tabs}`}>{tabsSlot(tabs)}</div>}
        {children != null && <div className={styles.list}>{children}</div>}
      </>
    ) : (
      <div className={styles.form}>
        {isShown(formFields) && (
          <div className={styles.fields}>{slot(formFields, <DefaultFormFields />)}</div>
        )}
        {slot(radio, <DefaultRadio />)}
        {slot(checkboxes, <DefaultCheckboxes />)}
        {slot(switches, <DefaultSwitches />)}
      </div>
    );

  const classes = [styles.dialog, modal && styles.modal, className].filter(Boolean).join(' ');
  const rootStyle = {
    ...(width !== undefined ? { '--dialog-width': typeof width === 'number' ? `${width}px` : width } : null),
    ...style,
  } as CSSProperties;
  const label = ariaLabelledBy ?? (ariaLabel === undefined && header === true && title != null ? titleId : undefined);

  const panel = (
    <>
      <div className={styles.handle} aria-hidden />
      <div ref={content} className={[styles.content, !hasFooter && styles.noFooter].filter(Boolean).join(' ')}>
        {headerNode && <div className={`${styles.fixed} ${styles.header}`}>{headerNode}</div>}
        {body}
        {hasFooter && <div className={`${styles.fixed} ${styles.footer}`}>{footerNode}</div>}
      </div>
    </>
  );

  if (!modal) {
    return (
      <div
        {...rest}
        ref={(node) => {
          root.current = node;
        }}
        role="dialog"
        aria-label={ariaLabel}
        aria-labelledby={label}
        className={classes}
        style={rootStyle}
        onClick={onClick}
      >
        {panel}
      </div>
    );
  }

  // A press on the backdrop is a click on the <dialog> itself, outside the panel.
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (event.defaultPrevented || event.target !== event.currentTarget) return;
    const box = content.current?.getBoundingClientRect();
    const inside =
      box && event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    if (!inside) onClose?.();
  };

  return (
    <dialog
      {...rest}
      ref={(node) => {
        root.current = node;
      }}
      aria-label={ariaLabel}
      aria-labelledby={label}
      className={classes}
      style={rootStyle}
      // Escape: let the app decide, so `open` stays the one source of truth.
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={handleClick}
    >
      {panel}
    </dialog>
  );
}

export default Dialog;
