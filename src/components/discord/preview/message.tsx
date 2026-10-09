import { ComponentType } from 'discord-api-types/v10';
import type z from 'zod';
import type { MessageUserComponentsSchema } from '@/lib/discord/zod';
import { cn } from '@/lib/utils';
import { ComponentV2 } from './components-v2';

export type MessagePreviewProps = {
  components: z.input<MessageUserComponentsSchema>;
};

export function DiscordMessage({ components }: MessagePreviewProps) {
  if (!components.length) return null;

  return (
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
}
