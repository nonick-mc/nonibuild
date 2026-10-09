'use client';

import { CircleHelpIcon } from 'lucide-react';
import { InlineCode } from '@/components/inline-code';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function AboutDialog() {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            className='sm:hidden'
            variant='outline'
            size='icon'
            aria-label='Component Embedsとは？'
          />
        }
      >
        <CircleHelpIcon />
      </DialogTrigger>
      <DialogTrigger render={<Button className='max-sm:hidden' variant='outline' />}>
        <CircleHelpIcon className='mt-0.5' />
        Component Embedsとは？
      </DialogTrigger>
      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Component Embedsとは？</DialogTitle>
        </DialogHeader>
        <div className='flex min-w-0 flex-col gap-4 text-sm leading-relaxed'>
          <p>
            <a
              className='text-primary underline underline-offset-4'
              href='https://docs.discord.com/developers/link-previews/component-embeds'
              target='_blank'
              rel='noreferrer'
            >
              Component Embeds
            </a>
            とは、Discord上でURLを送信した際に表示される埋め込みを、Webサイトの作成者が任意のコンポーネントにカスタマイズできる機能です。
          </p>
          {/* biome-ignore lint/performance/noImgElement: 静的サイトのため */}
          <img
            className='w-full rounded-xl border'
            src='https://cdn.nonick.net/nonibuild/what-is-component-embeds.png'
            alt='Component Embedsの表示例'
          />
          <p>
            Component Embedsを使用するためには、Webサイトの
            <InlineCode>{'<head>'}</InlineCode>
            タグに、
            <InlineCode>{'<script>'}</InlineCode>
            または
            <InlineCode>{'<link>'}</InlineCode>
            タグを使用して、要件を満たすJSONを配置する必要があります。nonibuildでは、このJSONファイルの作成を行うことができます。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
