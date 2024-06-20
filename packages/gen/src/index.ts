import { parse } from './parser';
import { mergeHighOverlapNodes, mergePosition, weightNode } from './toolkit';
import { SkeletonNode } from './type';

/**
 * 用于创建预览骨架屏 dom 节点
 * @param {*} sks
 * @returns
 */
function createSkeleton(sks: SkeletonNode[]) {
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
    margin: 5px 0;
    background: linear-gradient(
      90deg,
      hsla(0, 0%, 74.5%, 0.2) 25%,
      hsla(0, 0%, 50.6%, 0.24) 37%,
      hsla(0, 0%, 74.5%, 0.2) 63%
    );
    background-size: 400% 100%;
    border-radius: 2px;
    position: absolute;
    z-index: 999999;
  }
  `;

  const skeletonEl = sks.reduce((acc, cur) => {
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

  return skeletonDom;
}

/**
 * 预览
 * @param {*} sks
 */
export async function preview(el: Element, time: number = 5) {
  if (!el) {
    console.error('节点不存在');
    return;
  }
  const sks = await generate(el);
  const skeletonDom = createSkeleton(sks);
  const rect = el.getBoundingClientRect();
  const { x, y, width, height } = rect;

  // 创建一个预览容器大小位置跟 container 保持一致
  const previewDom = document.createElement('div');
  previewDom.setAttribute(
    'style',
    `position:absolute;width:${width}px;height:${height}px;left:${x}px;top:${y}px;z-index:999999999;overflow:hidden;`
  );
  previewDom.innerHTML = skeletonDom;
  document.body.appendChild(previewDom);

  // 将 container 容器透明度降到 0
  const containerStyle = window.getComputedStyle(el);
  const opacity = containerStyle.getPropertyValue('opacity');
  (el as HTMLElement).style.opacity = '0';

  // 还原回来
  setTimeout(
    () => {
      document.body.removeChild(previewDom);
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
export async function generate(dom: Element) {
  let nodes: SkeletonNode[] = parse(dom);

  nodes = mergePosition(nodes);
  nodes = mergeHighOverlapNodes(nodes);
  nodes = weightNode(nodes);

  return nodes;
}
