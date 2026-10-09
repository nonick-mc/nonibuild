'use client';

import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { LinkIcon, SmileIcon, Trash2Icon } from 'lucide-react';
import { useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { UnicodeEmojiPicker } from '@/components/discord/unicode-emoji-picker';
import {
  ControlledField,
  ControlledFieldError,
  ControlledFieldLabel,
} from '@/components/rhf/field';
import { ControlledInputGroupInput } from '@/components/rhf/input-group';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FieldContent, FieldGroup, FieldSeparator } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon, InputGroupButton } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverPanel, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { DiscordButtonEmoji } from '../../preview/button';
import { ComponentEditorContext } from '../context';
import { EditorCard } from '../editor-card';

export function createDefaultUrlButton() {
  return {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    url: '',
    label: '',
    emoji: null,
  } as const;
}

type EmojiValue = { id?: string; name: string; animated?: boolean };
type EmojiMode = 'custom' | 'unicode';

const CustomEmojiRegex = /^<(a)?:(\w{2,32}):(\d{17,19})>$/;

function formatCustomEmoji({ id, name, animated }: EmojiValue) {
  return id ? `<${animated ? 'a' : ''}:${name}:${id}>` : '';
}

function CustomEmojiForm({
  defaultValue,
  onSubmit,
}: {
  defaultValue?: EmojiValue | null;
  onSubmit: (value: EmojiValue) => void;
}) {
  const [text, setText] = useState(defaultValue ? formatCustomEmoji(defaultValue) : '');
  const [showError, setShowError] = useState(false);
  const match = CustomEmojiRegex.exec(text.trim());

  return (
    <FieldGroup className='gap-4'>
      <div className='flex flex-col gap-2'>
        <Label htmlFor='custom-emoji'>カスタム絵文字</Label>
        <p className='text-xs text-muted-foreground'>
          Discord上で絵文字の前に「\」をつけて送信し、表示されたテキストを貼り付けてください。
        </p>
        <Input
          id='custom-emoji'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='<:name:123456789012345678>'
          className='font-mono'
        />
      </div>
      {showError && !match && (
        <p className='text-sm text-destructive'>
          {'<:name:id>'} または {'<a:name:id>'} の形式で入力してください。
        </p>
      )}
      <Button
        type='button'
        size='sm'
        onClick={() => {
          setShowError(true);
          if (match) onSubmit({ id: match[3], name: match[2], animated: !!match[1] });
        }}
      >
        設定
      </Button>
    </FieldGroup>
  );
}

function EmojiField({ name }: { name: string }) {
  const { control } = useFormContext();
  const [mode, setMode] = useState<EmojiMode>('unicode');
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pendingMode = useRef<EmojiMode | null>(null);

  const selectMode = (value: EmojiMode) => {
    pendingMode.current = value;
    setMenuOpen(false);
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Popover
          open={popoverOpen}
          onOpenChange={(open, { reason }) => {
            // トリガーはメニューを開くためのもので、Popoverは開かない
            if (reason === 'trigger-press') return;
            setPopoverOpen(open);
          }}
        >
          <DropdownMenu
            open={menuOpen}
            onOpenChange={setMenuOpen}
            // メニューが閉じてから、選択された種類のPopoverを開く
            onOpenChangeComplete={(open) => {
              if (open || !pendingMode.current) return;
              setMode(pendingMode.current);
              pendingMode.current = null;
              setPopoverOpen(true);
            }}
          >
            <Tooltip>
              <TooltipTrigger
                render={
                  <PopoverTrigger
                    render={<DropdownMenuTrigger render={<InputGroupButton size='icon-xs' />} />}
                  />
                }
              >
                {field.value ? <DiscordButtonEmoji {...field.value} /> : <SmileIcon />}
              </TooltipTrigger>
              <TooltipContent>絵文字</TooltipContent>
            </Tooltip>
            <DropdownMenuContent align='start'>
              <DropdownMenuItem onClick={() => selectMode('custom')}>
                カスタム絵文字
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => selectMode('unicode')}>
                Unicode絵文字
              </DropdownMenuItem>
              {field.value && (
                <DropdownMenuItem variant='destructive' onClick={() => field.onChange(null)}>
                  <Trash2Icon />
                  絵文字を削除
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {mode === 'custom' ? (
            <PopoverContent side='top' align='start' className='w-72'>
              <CustomEmojiForm
                defaultValue={field.value}
                onSubmit={(value) => {
                  field.onChange(value);
                  setPopoverOpen(false);
                }}
              />
            </PopoverContent>
          ) : (
            <PopoverPanel side='top' align='start' initialFocus={false} finalFocus={false}>
              <UnicodeEmojiPicker
                onEmojiSelect={(value) => {
                  field.onChange({ name: value });
                  setPopoverOpen(false);
                }}
              />
            </PopoverPanel>
          )}
        </Popover>
      )}
    />
  );
}

type ButtonEditorProps = {
  basePath: string;
  onRemove: () => void;
  withSortableItemHandle?: boolean;
};

function ButtonLabelField({ basePath }: { basePath: string }) {
  const { control } = useFormContext();

  return (
    <ControlledField
      control={control}
      name={`${basePath}.label`}
      orientation='responsive'
      align='center'
    >
      <FieldContent>
        <ControlledFieldLabel>ラベル</ControlledFieldLabel>
        <ControlledFieldError />
      </FieldContent>
      <InputGroup className='sm:min-w-2xs'>
        <InputGroupAddon align='inline-start'>
          <EmojiField name={`${basePath}.emoji`} />
        </InputGroupAddon>
        <ControlledInputGroupInput placeholder='ラベルを入力' maxLength={80} />
      </InputGroup>
    </ControlledField>
  );
}

export function ButtonEditor({ basePath, onRemove, withSortableItemHandle }: ButtonEditorProps) {
  const { control } = useFormContext();

  return (
    <ComponentEditorContext.Provider value={{ basePath, onRemove }}>
      <EditorCard icon={LinkIcon} title='URLボタン' withSortableItemHandle={withSortableItemHandle}>
        <FieldGroup className='gap-5'>
          <ButtonLabelField basePath={basePath} />
          <FieldSeparator />
          <ControlledField
            control={control}
            name={`${basePath}.url`}
            orientation='responsive'
            align='center'
          >
            <FieldContent>
              <ControlledFieldLabel>URL</ControlledFieldLabel>
              <ControlledFieldError />
            </FieldContent>
            <InputGroup className='sm:min-w-2xs'>
              <ControlledInputGroupInput placeholder='URLを入力' />
              <InputGroupAddon align='inline-start'>
                <LinkIcon />
              </InputGroupAddon>
            </InputGroup>
          </ControlledField>
        </FieldGroup>
      </EditorCard>
    </ComponentEditorContext.Provider>
  );
}
