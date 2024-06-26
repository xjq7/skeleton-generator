import { parse } from './parser';
import { mergeHighOverlapNodes, mergePosition, weightNode } from './toolkit';
import { SkeletonNode, SkeletonSource } from './type';

/**
 * 用于创建预览骨架屏 dom 节点
 * @param {*} sks
 * @returns
 */
function createSkeleton(data: SkeletonSource) {
  const skeletonStyle = `
  .animated {
    animation: skeleton-loading 1.4s ease infinite;
  }
  
  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
  
    100% {
      background-position: 0 50%;
    }
  }
  
  .skeleton {
    background: linear-gradient(
      90deg,
      hsla(0, 0%, 74.5%, 0.2) 25%,
      hsla(0, 0%, 50.6%, 0.24) 37%,
      hsla(0, 0%, 74.5%, 0.2) 63%
    );
    background-size: 400% 100%;
    position: absolute;
  }
  `;

  const { children, container } = data;

  const skeletonEl = children.reduce((acc, cur) => {
    return (
      acc +
      `<div class="skeleton animated" style="opacity: ${cur.wg};top: ${cur.y}px; left: ${cur.x}px; width: ${
        cur.w
      }px; height: ${cur.h}px;border-radius: ${cur.br || 0}"></div>`
    );
  }, '');

  const skeletonDom = `
  <style>${skeletonStyle}</style>
  ${skeletonEl}
  `;

  const previewDom = document.createElement('div');
  const { x, y, w, h } = container;
  previewDom.setAttribute(
    'style',
    `position:absolute;width:${w}px;height:${h}px;left:${x}px;top:${y}px;z-index:999999;`
  );
  previewDom.innerHTML = `${skeletonDom}`;
  return previewDom;
}

/**
 * 预览
 * @param {*} sks
 */
export function preview(el: Element, time: number = 5) {
  if (!el) {
    console.error('节点不存在');
    return;
  }
  const skeletonSource = generate(el);
  const skeletonDom = createSkeleton(skeletonSource);
  // 创建一个预览容器大小位置跟 container 保持一致
  document.body.appendChild(skeletonDom);

  // 将 container 容器透明度降到 0
  const containerStyle = window.getComputedStyle(el);
  const opacity = containerStyle.getPropertyValue('opacity');
  (el as HTMLElement).style.opacity = '0';

  // 还原回来
  setTimeout(
    () => {
      document.body.removeChild(skeletonDom);
      (el as HTMLElement).style.opacity = opacity;
    },
    Number(time) * 1000
  );
}

/**
 * 生成骨架数据
 *
 * @export
 * @return {*}
 */
export function generate(dom: Element) {
  let { container, children: nodes } = parse(dom);

  nodes = mergePosition(nodes);
  nodes = mergeHighOverlapNodes(nodes);
  nodes = weightNode(nodes);

  return { container, children: nodes };
}
