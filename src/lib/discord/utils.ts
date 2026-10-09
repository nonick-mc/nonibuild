type CountableComponent = {
  type: unknown;
  components?: readonly CountableComponent[];
  accessory?: unknown;
};

/** Container等の子要素やSectionのaccessoryを含めた、コンポーネントの合計数 */
export function countTotalComponents(components: readonly CountableComponent[]): number {
  return components.reduce((total, component) => {
    let count = 1;
    if (component.components) count += countTotalComponents(component.components);
    if (component.accessory) count += 1;
    return total + count;
  }, 0);
}
