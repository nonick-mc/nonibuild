import { type RefObject, useState } from 'react';

export type TextInputRef = RefObject<HTMLInputElement | HTMLTextAreaElement | null>;

export function useTextInputInsert(inputRef: TextInputRef) {
  const [open, setOpen] = useState(false);

  function handleSelect(text: string) {
    const input = inputRef.current;
    if (!input) return;

    input.focus();
    document.execCommand('insertText', false, text);
    setOpen(false);
  }

  function handleOpenChangeComplete(isOpen: boolean) {
    if (isOpen) return;
    inputRef.current?.focus();
  }

  return { open, setOpen, handleSelect, handleOpenChangeComplete };
}
