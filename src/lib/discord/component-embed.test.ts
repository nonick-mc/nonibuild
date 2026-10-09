import assert from 'node:assert/strict';
import { test } from 'node:test';
import { ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { buildComponentEmbed, createComponentEmbedSchema } from './component-embed.ts';

const text = { type: ComponentType.TextDisplay, content: 'hello' } as const;
const container = (components: unknown[]) => ({ type: ComponentType.Container, components });
const gallery = (n: number, url = 'https://example.com/a.png?x=1') => ({
  type: ComponentType.MediaGallery,
  items: Array.from({ length: n }, () => ({ media: { url } })),
});
const ok = (v: unknown) => createComponentEmbedSchema().safeParse(v).success;

test('トップレベルは単一のContainerのみ', () => {
  assert.ok(ok([container([text])]));
  assert.ok(!ok([text]));
  assert.ok(!ok([container([text]), container([text])]));
});

test('Containerは入れ子にできない', () => {
  assert.ok(!ok([container([container([text])])]));
});

test('ボタンはLinkスタイルのみ', () => {
  const row = (button: object) => ({ type: ComponentType.ActionRow, components: [button] });
  const link = {
    type: ComponentType.Button,
    style: ButtonStyle.Link,
    url: 'https://a.com',
    label: 'a',
  };
  assert.ok(ok([container([row(link)])]));
  assert.ok(!ok([container([row({ ...link, style: ButtonStyle.Primary, custom_id: 'x' })])]));
});

test('ギャラリーは合計10個まで', () => {
  assert.ok(ok([container([gallery(5), gallery(5)])]));
  assert.ok(!ok([container([gallery(5), gallery(6)])]));
});

test('メディアURLの拡張子とスキームを検証する', () => {
  assert.ok(ok([container([gallery(1, 'https://a.com/x.mp4')])]));
  assert.ok(!ok([container([gallery(1, 'https://a.com/x.txt')])]));
  assert.ok(!ok([container([gallery(1, 'ftp://a.com/x.png')])]));
});

test('要素は40個まで (Containerを含む)', () => {
  assert.ok(!ok([container(Array.from({ length: 11 }, () => text))]));
});

test('ペイロードのバイト数を数え、<をエスケープする', () => {
  const { bytes, html } = buildComponentEmbed([
    container([{ ...text, content: '</script>あ' }]),
  ] as never);
  assert.ok(!html.slice(html.indexOf('>') + 1, html.lastIndexOf('<')).includes('</script>'));
  assert.ok(bytes > 0);
});
