'use client';

import { SmileIcon, TypeIcon } from 'lucide-react';
import { type RefObject, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { UnicodeEmojiPicker } from '@/components/discord/unicode-emoji-picker';
import { ControlledField, ControlledFieldError } from '@/components/rhf/field';
import { ControlledInputGroupTextarea } from '@/components/rhf/input-group';
import { InputGroup, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { Popover, PopoverPanel, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTextInputInsert } from '@/hooks/use-text-input-insert';
import { useComponentEditorContext } from '../context';
import { EditorCard } from '../editor-card';

export function TextDisplayEditor() {
  const { control } = useFormContext();
  const { basePath } = useComponentEditorContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <EditorCard withSortableItemHandle icon={TypeIcon} title='テキスト'>
      <ControlledField control={control} name={`${basePath}.content`}>
        <InputGroup className='max-h-96'>
          <ControlledInputGroupTextarea ref={textareaRef} placeholder='テキストを入力' />
          <InputGroupAddon align='block-end' className='flex items-center justify-end'>
            <EmojiInsertButton textareaRef={textareaRef} />
          </InputGroupAddon>
        </InputGroup>
        <ControlledFieldError />
      </ControlledField>
    </EditorCard>
  );
}

function EmojiInsertButton({
  textareaRef,
}: {
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}) {
  const { open, setOpen, handleSelect } = useTextInputInsert(textareaRef);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger render={<PopoverTrigger render={<InputGroupButton size='icon-xs' />} />}>
          <SmileIcon />
        </TooltipTrigger>
        <TooltipContent>絵文字</TooltipContent>
      </Tooltip>
      <PopoverPanel side='top' align='end' initialFocus={false} finalFocus={false}>
        <UnicodeEmojiPicker onEmojiSelect={handleSelect} />
      </PopoverPanel>
    </Popover>
  );
}
