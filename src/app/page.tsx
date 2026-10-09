import { ButtonStyle, ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import { FileJsonIcon } from 'lucide-react';
import { DiscordMessage, type MessagePreviewProps } from '@/components/discord/preview/message';
import { Main } from '@/components/main';
import { Navbar } from '@/components/navbar';
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid';

const previewComponents: MessagePreviewProps['components'] = [
  { type: ComponentType.TextDisplay, content: 'https://nonick.net' },
  {
    type: ComponentType.Container,
    spoiler: false,
    components: [
      {
        type: ComponentType.Section,
        components: [
          {
            type: ComponentType.TextDisplay,
            content:
              '## NoNICK\nインディーゲームとTypeScriptが好き。\n-# <:PartneredServerOwner:966753508860768357> Discord ・ <:cubee:916496869859938324> The HIVE パートナー',
          },
        ],
        accessory: {
          type: ComponentType.Thumbnail,
          media: { url: 'https://github.com/nonick-mc.png' },
          spoiler: false,
        },
      },
      { type: ComponentType.Separator, divider: false, spacing: SeparatorSpacingSize.Small },
      {
        type: ComponentType.ActionRow,
        components: [
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: 'https://youtube.com/nonick_mc',
            label: 'YouTube',
            emoji: { id: '966742261503234128', name: 'YouTube', animated: false },
          },
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: 'https://github.com/nonick-mc',
            label: 'GitHub',
            emoji: { id: '966742261465509928', name: 'Github', animated: false },
          },
          {
            type: ComponentType.Button,
            style: ButtonStyle.Link,
            url: 'https://x.com/nonick_mc',
            label: 'X',
            emoji: { id: '1557736460931563570', name: 'xcom', animated: false },
          },
        ],
      },
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Main>
        <BentoGrid>
          <BentoCard
            name='Component Embeds'
            description='Discord上に送信されたURLの埋め込みをカスタマイズするためのコードを作成します。'
            href='/component-embeds'
            cta='エディターを開く'
            Icon={FileJsonIcon}
            background={
              <div className='pointer-events-none absolute inset-0 select-none bg-discord-background p-4 [mask-image:linear-gradient(to_bottom,black_30%,transparent_75%)]'>
                <DiscordMessage
                  components={previewComponents}
                  author={{ name: 'NoNICK', avatarUrl: 'https://github.com/nonick-mc.png' }}
                />
              </div>
            }
          />
        </BentoGrid>
      </Main>
    </>
  );
}
