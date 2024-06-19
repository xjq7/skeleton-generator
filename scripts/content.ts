interface SkeletonNode {
  x: number;
  y: number;
  w: number;
  h: number;
  wg?: number; // 权值
  br?: string; // 圆角
}

interface Config {
  selector: string;
  previewTime: number;
}

/**
 * 获取配置信息
 *
 * @return {*}
 */
async function getConfig() {
  const storage = await chrome.storage.local.get();
  const {
    config = {
      selector: '.lowcode-container',
      previewTime: 5,
    },
  } = storage;
  return config as Config;
}

/**
 * 获取容器节点
 *
 * @return {*}
 */
async function getSelector() {
  const config = await getConfig();
  const { selector } = config;
  const containers = document.querySelectorAll(selector);
  return containers;
}

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
 * 创建一个图节点
 * @param {*} x
 * @param {*} y
 * @returns
 */
function createNode(x: number, y: number) {
  return `${x}_${y}`;
}

/**
 * 解构一个图节点，获取 x, y
 * @param {*} node
 * @returns
 */
function deconstructNode(node: string) {
  return node.split('_').map(Number);
}

/**
 * 对骨架屏数据做合并处理
 * 1. 过滤重复的
 * 2. 合并相邻且尺寸一致的
 * @param {*} nodes
 * @returns
 */
function mergePosition(nodes: SkeletonNode[]) {
  const graph: Record<string, [string, string]> = {};

  const brs: Record<string, string> = {};

  const marked: Record<string, boolean> = {};

  function findEnd(gNodeTail: string, isX: boolean, size: number) {
    if (!graph[gNodeTail]) return gNodeTail;
    let tail = gNodeTail;
    const [x, y] = deconstructNode(gNodeTail);
    const [ln, rn] = graph[gNodeTail];

    if (isX) {
      const [, cy] = deconstructNode(rn);
      const h = cy - y;
      if (Math.abs(h - size) < 2) {
        tail = findEnd(ln, isX, size);
      }
    } else {
      const [cx] = deconstructNode(ln);
      const w = cx - x;
      if (Math.abs(w - size) < 2) {
        tail = findEnd(rn, isX, size);
      }
    }

    if (gNodeTail !== tail) {
      marked[gNodeTail] = true;
    }

    return tail;
  }
  nodes.forEach((node) => {
    const { x, y, w, h, br } = node;

    const x1 = x + w;
    const y1 = y + h;

    const gNode1 = createNode(x, y);
    if (br) {
      brs[gNode1] = br;
    }

    if (graph[gNode1]) {
      const [x1, y1] = graph[gNode1];

      const [xx] = deconstructNode(x1);
      const [, yy] = deconstructNode(y1);
      const gNode2 = createNode(Math.max(xx, x), y);
      const gNode3 = createNode(x, Math.max(y, yy));
      graph[gNode1] = [gNode2, gNode3];
    } else {
      const gNode2 = createNode(x1, y);
      const gNode3 = createNode(x, y1);

      graph[gNode1] = [gNode2, gNode3];
    }
  });

  const nNodes = [];

  for (const gNode in graph) {
    if (!marked[gNode]) {
      const [x, y] = deconstructNode(gNode);

      const [gNode1, gNode2] = graph[gNode];
      const [x1] = deconstructNode(gNode1);
      const [, y2] = deconstructNode(gNode2);
      const h = y2 - y;
      const w = x1 - x;

      const tailX = findEnd(gNode1, true, h);
      const tailY = findEnd(gNode2, false, w);

      const [tx] = deconstructNode(tailX);
      const [, ty] = deconstructNode(tailY);

      nNodes.push({
        x,
        y,
        w: tx - x,
        h: ty - y,
        br: brs[gNode],
        wg: 1,
      });

      marked[gNode] = true;
    }
  }

  return nNodes;
}

/**
 * 合并边界框重叠度 > 0.8 的元素
 * @param {*} nodes 节点信息
 * @returns
 */
function mergeHighOverlapNodes(nodes: SkeletonNode[]) {
  // 标记节点是否合并过
  const mergedFlags: boolean[] = Array.from({ length: nodes.length }, () => false);
  // 合并后的节点
  const mergedNodes: SkeletonNode[] = [];

  for (let i = 0; i < nodes.length; i++) {
    if (mergedFlags[i]) continue;

    let n1 = nodes[i];
    const { x: x1, y: y1, w: w1, h: h1, br: br1, wg: wg1 } = n1;
    let merged = false;

    for (let j = i + 1; j < nodes.length; j++) {
      if (mergedFlags[j]) continue;

      const n2 = nodes[j];
      const { x: x2, y: y2, w: w2, h: h2, br: br2, wg: wg2 } = n2;

      // 计算重叠度
      const xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
      const yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));
      const overlap = (xOverlap * yOverlap) / (w1 * h1 + w2 * h2 - xOverlap * yOverlap);

      if (overlap > 0.8) {
        // 合并节点
        n1 = {
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          w: Math.max(x1 + w1, x2 + w2) - Math.min(x1, x2),
          h: Math.max(y1 + h1, y2 + h2) - Math.min(y1, y2),
          br: br1 || br2,
          wg: Math.max(wg1 || 1, wg2 || 1),
        };

        // 标记节点已被合并过
        mergedFlags[j] = true;
        merged = true;
      }
    }

    // 添加合并后的节点
    mergedNodes.push(n1);
    mergedFlags[i] = merged;
  }

  return mergedNodes;
}

/**
 * 从 container 节点获取它下面的骨架屏 数据
 * @param {*} pel
 * @returns
 */
function mapElNodes(containerEl: Element | null) {
  if (!containerEl) return [];
  const { children } = containerEl;
  const stack = Array.from(children);
  const nodes = [];

  const rect = containerEl.getBoundingClientRect();
  const { x: px, y: py } = rect;

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
  return nodes;
}

/**
 * 节点加权
 *
 * @param {SkeletonNode[]} nodes
 * @return {*}
 */
function weightNode(nodes: SkeletonNode[]) {
  nodes.forEach((node1) => {
    const { x, y, w, h } = node1;

    nodes.forEach((node2) => {
      const { x: x1, y: y1, w: w1, h: h1 } = node2;

      if (x1 < x && y1 < y && w1 + x1 > w + x && h1 + y1 > h + y) {
        node2.wg = (node1.wg || 1) + 1;
      }
    });
  });

  return nodes;
}

/**
 * 当前页预览骨架屏
 * @param {*} sks
 */
async function preview(sks: SkeletonNode[]) {
  const containers = await getSelector();
  if (!containers || !containers.length) return;
  const skeletonDom = createSkeleton(sks);
  const container = containers[0];
  const rect = container.getBoundingClientRect();
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
  const containerStyle = window.getComputedStyle(container);
  const opacity = containerStyle.getPropertyValue('opacity');
  (container as HTMLElement).style.opacity = '0';

  const config = await getConfig();
  const { previewTime } = config;
  // 还原回来
  setTimeout(() => {
    document.body.removeChild(previewDom);
    (container as HTMLElement).style.opacity = opacity;
  }, Number(previewTime) * 1000);
}

const copy = (text: string) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text);
  } else {
    const input = document.createElement('textarea');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
  }
};

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  const { action, data } = request;

  const containers = await getSelector();

  let nodes: SkeletonNode[] = mapElNodes(containers[0]);

  nodes = mergePosition(nodes);
  nodes = mergeHighOverlapNodes(nodes);
  nodes = weightNode(nodes);

  // 预览处理
  if (action === 'preview') {
    preview(nodes);
  } else if (action === 'copy') {
    // 将节点数据 copy 到剪贴板
    copy(JSON.stringify(nodes));
  } else if (action === 'setConfig') {
    console.log(data);
    localStorage.setItem('config', JSON.stringify(data));
  }
});
