'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentType } from 'discord-api-types/v10';
import { CheckIcon, EyeIcon, PencilIcon } from 'lucide-react';
import { useMemo, useState, useSyncExternalStore } from 'react';
import { FormProvider, useFieldArray, useForm, Watch } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { ComponentsV2Editor } from '@/components/discord/components-v2-editor';
import { defaultComponentValues } from '@/components/discord/components-v2-editor/schema';
import { DiscordMessage } from '@/components/discord/preview/message';
import { Navbar } from '@/components/navbar';
import { ControlledFieldError, ControlledFieldProvider } from '@/components/rhf/field';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  buildComponentEmbed,
  createComponentEmbedSchema,
  MaxEmbedBytes,
} from '@/lib/discord/component-embed';
import { cn } from '@/lib/utils';
import { AboutDialog } from './about-dialog';
import { CreateDialog, type CreatedEmbed } from './create-dialog';

export function ComponentEmbedEditor() {
  // useFieldArrayのidはレンダリングごとに生成されるため、SSRとhydrationで一致しない。
  // idをDOMに出力するエディターはクライアントでのみ描画
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [created, setCreated] = useState<CreatedEmbed | null>(null);

  const schema = useMemo(() => z.object({ components: createComponentEmbedSchema() }), []);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { components: [defaultComponentValues[ComponentType.Container]] },
  });
  const { fields, remove, move } = useFieldArray({ control: form.control, name: 'components' });

  const handleCreate = form.handleSubmit(
    ({ components }) => {
      const embed = buildComponentEmbed(components);
      if (embed.bytes > MaxEmbedBytes) {
        form.setError('components', {
          message: `サイズが上限(${MaxEmbedBytes} bytes)を超えています。(${embed.bytes} bytes)`,
        });
        return;
      }
      setCreated(embed);
    },
    () => toast.error('入力内容を確認してください。'),
  );

  return (
    <FormProvider {...form}>
      <Navbar page='component-embeds'>
        <AboutDialog />
      </Navbar>
      <main className='mx-auto flex w-full max-w-350 flex-1 flex-col gap-3 p-6'>
        <ControlledFieldProvider control={form.control} name='components'>
          <ControlledFieldError />
        </ControlledFieldProvider>
        <Tabs
          className='md:hidden'
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as 'editor' | 'preview')}
        >
          <TabsList className='w-full'>
            <TabsTrigger value='editor'>
              <PencilIcon />
              エディター
            </TabsTrigger>
            <TabsTrigger value='preview'>
              <EyeIcon />
              プレビュー
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className='flex flex-1 items-start gap-6'>
          {mounted ? (
            <ComponentsV2Editor
              className={cn('flex-1 min-w-0', activeTab === 'preview' && 'max-md:hidden')}
              name='components'
              fields={fields}
              remove={remove}
              move={move}
              topLevel='single-container'
            />
          ) : (
            <div className='flex-1 min-w-0' />
          )}
          <div
            className={cn(
              'sticky top-20 flex flex-1 min-w-0 flex-col gap-3',
              activeTab === 'editor' && 'max-md:hidden',
            )}
          >
            {/* 100dvh - sticky位置(80px) - 下余白(24px) - ボタン(36px) - gap(12px) */}
            <div className='flex max-h-[calc(100dvh-152px)] flex-col bg-discord-background border rounded-xl'>
              <div className='overflow-y-auto no-scrollbar scroll-fade-y max-sm:p-4 p-6'>
                <Watch
                  control={form.control}
                  name='components'
                  render={(components) => <DiscordMessage components={components} />}
                />
              </div>
            </div>
            <Button onClick={handleCreate}>
              <CheckIcon className='mt-0.5' />
              コードを生成
            </Button>
          </div>
        </div>
      </main>
      <CreateDialog embed={created} onOpenChange={(open) => !open && setCreated(null)} />
    </FormProvider>
  );
}
