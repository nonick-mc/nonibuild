import { createContext, useContext } from 'react';

type ComponentEditorContextValue = {
  basePath: string;
  onRemove: () => void;
  /** 削除・並び替えができない固定の要素 */
  locked?: boolean;
};

export const ComponentEditorContext = createContext<ComponentEditorContextValue | null>(null);

export function useComponentEditorContext() {
  const ctx = useContext(ComponentEditorContext);
  if (!ctx)
    throw new Error(
      'useComponentEditorContext must be used within ComponentEditorContext.Provider',
    );
  return ctx;
}
