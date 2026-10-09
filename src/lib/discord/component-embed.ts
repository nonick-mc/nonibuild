import { ComponentType } from 'discord-api-types/v10';
import type z from 'zod';
import { createMessageUserComponentsSchema } from './zod';

export const MaxEmbedBytes = 3000;
export const MaxEmbedMediaItems = 10;
export const MaxMediaUrlLength = 2048;

const MediaExtensions = [
  'png',
  'gif',
  'jpg',
  'jpeg',
  'webp',
  'avif', // 画像
  'mp4',
  'webm',
  'mov', // 動画
];

type EmbedComponents = z.output<ReturnType<typeof createMessageUserComponentsSchema>>;

function validateMediaUrl(value: string): string | null {
  if (value.length > MaxMediaUrlLength) return `URLは${MaxMediaUrlLength}文字以内にしてください。`;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return '有効なURLを入力してください。';
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return 'URLはhttpまたはhttpsで始めてください。';
  }
  // クエリを除いたパス部分で拡張子を判定する
  const extension = url.pathname.split('.').pop()?.toLowerCase();
  if (!extension || !MediaExtensions.includes(extension)) {
    return `URLの拡張子は${MediaExtensions.join(', ')}のいずれかにしてください。`;
  }
  return null;
}

/** Component Embeds用のスキーマ。トップレベルは単一のContainerのみ。 */
export function createComponentEmbedSchema() {
  return createMessageUserComponentsSchema({ topLevel: 'single-container' }).superRefine(
    (components, ctx) => {
      let galleryItems = 0;
      const check = (url: string, path: (string | number)[]) => {
        const message = validateMediaUrl(url);
        if (message) ctx.addIssue({ code: 'custom', message, path });
      };

      components.forEach((top, i) => {
        if (top.type !== ComponentType.Container) return;
        top.components.forEach((child, j) => {
          const base = [i, 'components', j];
          if (child.type === ComponentType.MediaGallery) {
            galleryItems += child.items.length;
            child.items.forEach((item, k) => {
              check(item.media.url, [...base, 'items', k, 'media', 'url']);
            });
          } else if (
            child.type === ComponentType.Section &&
            child.accessory.type === ComponentType.Thumbnail
          ) {
            check(child.accessory.media.url, [...base, 'accessory', 'media', 'url']);
          }
        });
      });

      if (galleryItems > MaxEmbedMediaItems) {
        ctx.addIssue({
          code: 'custom',
          message: `ギャラリーの画像は合計${MaxEmbedMediaItems}個までです。`,
        });
      }
    },
  );
}

/** 検証済みの値から、埋め込み用のペイロードを生成する */
export function buildComponentEmbed(components: EmbedComponents) {
  const payload = { component: components[0] };
  // </script>で埋め込みが途切れないよう、"<"はエスケープする (エスケープ後の長さで数える)
  const json = JSON.stringify(payload).replace(/</g, '\\u003c');
  return {
    bytes: new TextEncoder().encode(json).length,
    json: JSON.stringify(JSON.parse(json), null, 2),
    html: `<script id="discord:component-embed" type="application/json">\n${json}\n</script>`,
  };
}
