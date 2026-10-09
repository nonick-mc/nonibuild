import { ButtonStyle, ComponentType, SeparatorSpacingSize } from 'discord-api-types/v10';
import z from 'zod';
import { countTotalComponents } from './utils';

export const SnowflakeRegex = /^\d{17,19}$/;

const urlSchema = z
  .string({ error: '有効なURLを入力してください。' })
  .min(1, '有効なURLを入力してください。')
  .refine((value) => z.url().safeParse(value).success, {
    error: '有効なURLを入力してください。',
  });

function createUserComponentV2Schema() {
  const UnfurledMediaItem = z.object({ url: urlSchema });

  const MediaGalleryItem = z.object({
    media: UnfurledMediaItem,
    description: z
      .string()
      .max(1024)
      .nullish()
      .transform((v) => v ?? undefined),
    spoiler: z.boolean().optional(),
  });

  const TextDisplay = z.object({
    type: z.literal(ComponentType.TextDisplay),
    id: z.number().int().optional(),
    content: z.string().min(1, 'テキストを入力してください。'),
  });

  const Thumbnail = z.object({
    type: z.literal(ComponentType.Thumbnail),
    id: z.number().int().optional(),
    media: UnfurledMediaItem,
    description: z
      .string()
      .max(1024)
      .nullish()
      .transform((v) => v ?? undefined),
    spoiler: z.boolean().optional(),
  });

  const MediaGallery = z.object({
    type: z.literal(ComponentType.MediaGallery),
    id: z.number().int().optional(),
    items: z.array(MediaGalleryItem).min(1, '画像が少なくとも1つ以上必要です。').max(10),
  });

  const Separator = z.object({
    type: z.literal(ComponentType.Separator),
    id: z.number().int().optional(),
    divider: z.boolean().optional(),
    spacing: z.enum(SeparatorSpacingSize).optional(),
  });

  // インタラクションを発生させないURLボタンのみ対応する
  const Button = z
    .object({
      type: z.literal(ComponentType.Button),
      id: z.number().int().optional(),
      style: z.literal(ButtonStyle.Link),
      url: urlSchema.max(512),
      label: z
        .string()
        .max(80)
        .optional()
        .transform((v) => v || undefined),
      emoji: z
        .object({
          id: z.string().regex(SnowflakeRegex, '無効なIDです').optional(),
          name: z.string().min(1, '名前を入力してください。'),
          animated: z.boolean().optional(),
        })
        .nullish()
        .transform((v) => v ?? undefined),
    })
    .refine((v) => !!(v.label || v.emoji), {
      error: 'ラベルまたは絵文字を設定してください。',
      path: ['label'],
    });

  const ActionRow = z.object({
    type: z.literal(ComponentType.ActionRow),
    id: z.number().int().optional(),
    components: z.array(Button).min(1, '要素が少なくとも1つ以上必要です。').max(5),
  });

  const Section = z.object({
    type: z.literal(ComponentType.Section),
    id: z.number().int().optional(),
    components: z.array(TextDisplay).min(1, '要素が少なくとも1つ以上必要です。').max(3),
    accessory: z
      .discriminatedUnion('type', [Thumbnail, Button])
      // エディターでは未設定をnullで表す (RHFはundefinedを初期値にフォールバックするため)
      .nullable()
      .transform((v, ctx) => {
        if (v) return v;
        ctx.addIssue({ code: 'custom', message: 'サムネイルまたはボタンを設定してください。' });
        return z.NEVER;
      }),
  });

  const ComponentsInContainer = [Section, TextDisplay, MediaGallery, Separator, ActionRow] as const;

  const Container = z.object({
    type: z.literal(ComponentType.Container),
    id: z.number().int().optional(),
    accent_color: z
      .number()
      .int()
      .min(0)
      .max(0xffffff)
      .nullable()
      .optional()
      .transform((v) => v ?? undefined),
    spoiler: z.boolean().optional(),
    components: z
      .array(z.discriminatedUnion('type', ComponentsInContainer))
      .min(1, '要素が少なくとも1つ以上必要です。')
      .max(10),
  });

  const TopLevelComponent = z.discriminatedUnion('type', [Container, ...ComponentsInContainer]);

  return { TopLevelComponent };
}

type CreateMessageUserComponentsSchemaOptions = {
  /**
   * トップレベルに配置できるコンポーネント。
   * - `any`: 全てのコンポーネント
   * - `single-container`: 単一のContainerのみ
   */
  topLevel?: 'any' | 'single-container';
};

export function createMessageUserComponentsSchema({
  topLevel = 'any',
}: CreateMessageUserComponentsSchemaOptions = {}) {
  const { TopLevelComponent } = createUserComponentV2Schema();

  return z
    .array(TopLevelComponent)
    .min(1, '要素が少なくとも1つ以上必要です。')
    .superRefine((components, ctx) => {
      if (
        topLevel === 'single-container' &&
        (components.length !== 1 || components[0].type !== ComponentType.Container)
      ) {
        ctx.addIssue({ code: 'custom', message: 'コンテナを1つだけ配置してください。' });
      }
      if (countTotalComponents(components) > 40) {
        ctx.addIssue({
          code: 'custom',
          message: '要素の合計が40を超えています',
        });
      }
    });
}
export type MessageUserComponentsSchema = ReturnType<typeof createMessageUserComponentsSchema>;
