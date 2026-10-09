import { ComponentType } from 'discord-api-types/v10';
import type z from 'zod';
import type { MessageUserComponentsSchema } from '@/lib/discord/zod';
import { cn } from '@/lib/utils';
import { ComponentV2 } from './components-v2';

export type MessagePreviewProps = {
  components: z.input<MessageUserComponentsSchema>;
  author?: { name: string; avatarUrl: string };
};

export function DiscordMessage({ components, author }: MessagePreviewProps) {
  if (!components.length) return null;

  const body = (
    <div className='max-w-150 min-h-30'>
      {/* ContainerとSectionは一番幅の広いものに揃える */}
      <div className='grid grid-cols-[auto_1fr] gap-y-2'>
        {components.map((component, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: index以外に使用できない
            key={i}
            className={cn(
              'min-w-0',
              component.type === ComponentType.Container || component.type === ComponentType.Section
                ? 'col-start-1'
                : 'col-span-2',
            )}
          >
            <ComponentV2 component={component} />
          </div>
        ))}
      </div>
    </div>
  );

  if (!author) return body;

  return (
    <div className='flex gap-3'>
      {/* biome-ignore lint/performance/noImgElement: 静的サイトのため */}
      <img
        src={author.avatarUrl}
        alt={author.name}
        className='mt-0.5 size-10 shrink-0 rounded-full'
      />
      <div className='min-w-0 flex-1'>
        <span className='text-sm font-medium leading-none'>{author.name}</span>
        <div className='mt-1'>{body}</div>
      </div>
    </div>
  );
}
