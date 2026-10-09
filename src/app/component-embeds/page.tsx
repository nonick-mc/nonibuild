import type { Metadata } from 'next';
import { ComponentEmbedEditor } from './editor';

export const metadata: Metadata = {
  title: 'Component Embeds',
};

export default function ComponentEmbedsPage() {
  return <ComponentEmbedEditor />;
}
