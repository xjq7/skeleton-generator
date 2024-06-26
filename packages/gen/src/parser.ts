import { SkeletonNode } from './type';

/**
 * 从 container 节点获取它下面的骨架屏 数据
 * @param {*}
 * @returns
 */
export function parse(containerEl: Element | null) {
  if (!containerEl) return { container: {}, children: [] as SkeletonNode[] };
  const { children } = containerEl;

  const stack = Array.from(children);
  const nodes = [];

  const rect = containerEl.getBoundingClientRect();
  let { x: px, y: py, width, height } = rect;
  px = Math.floor(px);
  py = Math.floor(py);
  width = Math.floor(width);
  height = Math.floor(height);

  let borderRadius = '';

  while (stack.length) {
    const el = stack.pop() as Element;
    let { innerHTML, children, tagName } = el;

    const computedStyle = window.getComputedStyle(el);

    if (children.length === 1) {
      const curBorderRadius = computedStyle.getPropertyValue('border-radius');
      if (curBorderRadius && curBorderRadius !== '0px' && curBorderRadius !== '0%') {
        borderRadius = curBorderRadius;
      }
    } else if (children.length > 1) {
      borderRadius = '';
    }

    const rect = el.getBoundingClientRect();
    const { x, y, width, height } = rect;

    stack.push(...Array.from(children).reverse());

    if (typeof innerHTML === 'string') {
      innerHTML = innerHTML.trim();
    }

    const backgroundImage = computedStyle.getPropertyValue('background-image');
    const backgroundColor = computedStyle.getPropertyValue('background-color');

    if (
      tagName === 'IMG' ||
      tagName === 'INPUT' ||
      (children.length === 0 && innerHTML !== '') ||
      backgroundImage !== 'none' ||
      backgroundColor !== 'rgba(0, 0, 0, 0)'
    ) {
      const w = Math.floor(width);
      const h = Math.floor(height);
      if (w > 0 && h > 0) {
        nodes.push({
          x: Math.floor(x - px),
          y: Math.floor(y - py),
          w,
          h,
          br: borderRadius,
          wg: 1,
        });
      }
      borderRadius = '';
    }

    if (children.length === 0) {
      borderRadius = '';
    }
  }
  return {
    container: {
      w: width,
      h: height,
      x: px,
      y: py,
    },
    children: nodes,
  };
}
