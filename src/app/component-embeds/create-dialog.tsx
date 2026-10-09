'use client';

import { InfoIcon } from 'lucide-react';
import { toast } from 'sonner';
import { InlineCode } from '@/components/inline-code';
import { Alert, AlertTitle } from '@/components/reui/alert';
import {
  CodeBlock,
  CodeBlockContent,
  CodeBlockCopyButton,
} from '@/components/reui/code-block/code-block';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type CreatedEmbed = { html: string; json: string; bytes: number };

function EmbedCode({ code, language }: { code: string; language: string }) {
  return (
    <CodeBlock code={code} language={language}>
      <CodeBlockCopyButton
        onCopy={() => toast.success('コピーしました！')}
        onCopyError={() => toast.error('コピーに失敗しました。')}
      />
      {/* 縦横のスクロールはこの要素が担当する */}
      <div className='max-h-80 overflow-auto rounded-[inherit] [scrollbar-width:thin]'>
        <CodeBlockContent />
      </div>
    </CodeBlock>
  );
}

type CreateDialogProps = {
  embed: CreatedEmbed | null;
  onOpenChange: (open: boolean) => void;
};

export function CreateDialog({ embed, onOpenChange }: CreateDialogProps) {
  return (
    <Dialog open={!!embed} onOpenChange={onOpenChange}>
      <DialogContent className='grid-cols-[minmax(0,1fr)] sm:max-w-2xl'>
        <DialogHeader>
          <DialogTitle>コードを生成</DialogTitle>
        </DialogHeader>
        {embed && (
          <Tabs className='min-w-0' defaultValue='html'>
            <TabsList className='w-full'>
              <TabsTrigger value='html'>HTML</TabsTrigger>
              <TabsTrigger value='json'>JSON</TabsTrigger>
            </TabsList>
            <TabsContent className='min-w-0 flex flex-col gap-3 mt-1' value='html'>
              <Alert variant='info'>
                <InfoIcon />
                <AlertTitle>
                  この<InlineCode>{'<script>'}</InlineCode>タグをWebサイトの
                  <InlineCode>{'<head>'}</InlineCode>タグの中に配置してください。
                </AlertTitle>
              </Alert>
              <EmbedCode code={embed.html} language='html' />
            </TabsContent>
            <TabsContent className='min-w-0' value='json'>
              <EmbedCode code={embed.json} language='json' />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
