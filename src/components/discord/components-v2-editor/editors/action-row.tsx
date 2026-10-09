'use client';

import { ComponentIcon, PlusIcon, RectangleEllipsisIcon } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Sortable, SortableItem } from '@/components/reui/sortable';
import {
  ControlledField,
  ControlledFieldError,
  ControlledFieldLabel,
} from '@/components/rhf/field';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { useComponentEditorContext } from '../context';
import { EditorCard } from '../editor-card';
import { ButtonEditor, createDefaultUrlButton } from './button';

export function ActionRowEditor() {
  const { control } = useFormContext();
  const { basePath } = useComponentEditorContext();

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: `${basePath}.components`,
  });

  return (
    <EditorCard withSortableItemHandle icon={RectangleEllipsisIcon} title='アクション行'>
      <ControlledField control={control} name={`${basePath}.components`}>
        <ControlledFieldLabel className='sr-only'>アクション行内の要素</ControlledFieldLabel>
        <ControlledFieldError />
        <div className='flex flex-col gap-3'>
          {fields.length ? (
            <Sortable
              className='flex flex-col gap-3'
              value={fields.map((f) => ({ id: f.id }))}
              onValueChange={() => {}}
              getItemValue={(item) => item.id}
              onMove={({ activeIndex, overIndex }) => move(activeIndex, overIndex)}
              strategy='vertical'
            >
              {fields.map((field, index) => (
                <SortableItem key={field.id} value={field.id}>
                  <ButtonEditor
                    basePath={`${basePath}.components.${index}`}
                    onRemove={() => remove(index)}
                    withSortableItemHandle
                  />
                </SortableItem>
              ))}
            </Sortable>
          ) : (
            <Empty className='border border-dashed py-6'>
              <EmptyHeader>
                <EmptyMedia variant='icon'>
                  <ComponentIcon />
                </EmptyMedia>
                <EmptyTitle className='text-foreground'>要素がありません</EmptyTitle>
              </EmptyHeader>
            </Empty>
          )}
          <Button
            className='sm:w-fit text-foreground'
            variant='outline'
            size='sm'
            onClick={() => append(createDefaultUrlButton())}
            disabled={fields.length >= 5}
          >
            <PlusIcon />
            URLボタンを追加
          </Button>
        </div>
      </ControlledField>
    </EditorCard>
  );
}
